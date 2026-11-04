import { supabase } from "@/integrations/supabase/client";
import { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import {
  BSC_PERSPECTIVES,
  BscMeasure,
  BscObjective,
  BscPerspective,
  objectiveProgress,
} from "@/types/strategic-planning";
import { addIndicator } from "@/services/indicatorService";
import { IndicatorType } from "@/types/indicators";

export const MAX_KEY_RESULTS = 5;

export type ObjectiveInput = Omit<TablesInsert<'bsc_objectives'>, 'id' | 'company_id' | 'created_at' | 'updated_at' | 'created_by'>;
export type ObjectiveUpdate = Omit<TablesUpdate<'bsc_objectives'>, 'id' | 'company_id' | 'created_at' | 'updated_at' | 'created_by'>;
export type KeyResultInput = Omit<TablesInsert<'bsc_measures'>, 'id' | 'company_id' | 'created_at' | 'updated_at'>;
export type KeyResultUpdate = Omit<TablesUpdate<'bsc_measures'>, 'id' | 'company_id' | 'created_at' | 'updated_at' | 'progress'>;

export interface ObjectiveFilter {
  cycleId?: string;
  status?: BscObjective['status'];
}

/** Objetivos com resultados-chave aninhados e progresso médio. */
export async function getObjectives(filter: ObjectiveFilter = {}): Promise<BscObjective[]> {
  let objectivesQuery = supabase
    .from('bsc_objectives')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });
  if (filter.cycleId) objectivesQuery = objectivesQuery.eq('cycle_id', filter.cycleId);
  if (filter.status) objectivesQuery = objectivesQuery.eq('status', filter.status);

  const [{ data: objRows, error: objError }, { data: measureRows, error: measureError }] = await Promise.all([
    objectivesQuery,
    supabase.from('bsc_measures').select('*').order('created_at', { ascending: true }),
  ]);

  if (objError) {
    console.error("Error fetching objectives:", objError);
    throw new Error(objError.message);
  }
  if (measureError) {
    console.error("Error fetching key results:", measureError);
    throw new Error(measureError.message);
  }

  const measures = (measureRows ?? []).map(normalizeMeasure);

  return (objRows ?? []).map(o => {
    const krs = measures.filter(m => m.objective_id === o.id);
    return { ...o, measures: krs, progress: objectiveProgress(krs) } as BscObjective;
  });
}

function normalizeMeasure(m: BscMeasure): BscMeasure {
  return {
    ...m,
    target: Number(m.target),
    start_value: Number(m.start_value),
    current_value: m.current_value === null ? null : Number(m.current_value),
    progress: m.progress === null ? null : Number(m.progress),
  };
}

/**
 * Agrupa os objetivos ativos pelas 4 perspectivas BSC.
 * Objetivos sem perspectiva entram em "internal_process" apenas para o relatório.
 */
export async function getBscPerspectives(): Promise<BscPerspective[]> {
  const objectives = await getObjectives({ status: 'active' });
  return BSC_PERSPECTIVES.map(perspective => ({
    id: perspective,
    perspective,
    objectives: objectives.filter(o => (o.perspective ?? 'internal_process') === perspective),
    created_at: '',
    updated_at: '',
  }));
}

export async function createObjective(objective: ObjectiveInput): Promise<BscObjective> {
  const { data, error } = await supabase
    .from('bsc_objectives')
    .insert({ description: '', source: 'manual', ...objective })
    .select()
    .single();
  if (error) {
    console.error("Error creating objective:", error);
    throw new Error(error.message);
  }
  return { ...data, measures: [], progress: null } as BscObjective;
}

export async function updateObjective(id: string, objective: ObjectiveUpdate): Promise<void> {
  const { error } = await supabase.from('bsc_objectives').update(objective).eq('id', id);
  if (error) {
    console.error("Error updating objective:", error);
    throw new Error(error.message);
  }
}

/** Encerra o objetivo com nota (0 a 1) e aprendizados. */
export async function closeObjective(id: string, input: { score: number; learnings: string }): Promise<void> {
  await updateObjective(id, { status: 'closed', score: input.score, learnings: input.learnings });
}

export async function deleteObjective(id: string): Promise<void> {
  const { error } = await supabase.from('bsc_objectives').delete().eq('id', id);
  if (error) {
    console.error("Error deleting objective:", error);
    throw new Error(error.message);
  }
}

export async function createKeyResult(measure: KeyResultInput): Promise<BscMeasure> {
  const { data, error } = await supabase.from('bsc_measures').insert(measure).select().single();
  if (error) {
    console.error("Error creating key result:", error);
    throw new Error(error.message);
  }
  return normalizeMeasure(data);
}

export async function updateKeyResult(id: string, measure: KeyResultUpdate): Promise<void> {
  const { error } = await supabase.from('bsc_measures').update(measure).eq('id', id);
  if (error) {
    console.error("Error updating key result:", error);
    throw new Error(error.message);
  }
}

export async function deleteKeyResult(id: string): Promise<void> {
  const { error } = await supabase.from('bsc_measures').delete().eq('id', id);
  if (error) {
    console.error("Error deleting key result:", error);
    throw new Error(error.message);
  }
}

export interface LinkedKeyResultInput {
  objective_id: string;
  name: string;
  start_value?: number;
  target: number;
  unit: string;
  owner_id?: string | null;
  description?: string;
  goal_type?: IndicatorType['goal_type'];
  calculation_type?: IndicatorType['calculation_type'];
  process?: string;
}

/**
 * Cria um KPI real (performance_indicators) e o resultado-chave ligado a ele.
 * Check-ins do KPI passam a atualizar o resultado-chave.
 */
export async function createMeasureWithIndicator(input: LinkedKeyResultInput): Promise<BscMeasure> {
  const indicator = await addIndicator({
    name: input.name,
    description: input.description || `KPI estratégico: ${input.name}`,
    process: input.process || 'Estratégico',
    goal_type: input.goal_type || 'higher_better',
    goal_value: input.target,
    calculation_type: input.calculation_type || 'average',
    unit: input.unit,
    owner_id: input.owner_id ?? null,
  });

  return createKeyResult({
    objective_id: input.objective_id,
    name: input.name,
    start_value: input.start_value ?? 0,
    target: input.target,
    unit: input.unit,
    owner_id: input.owner_id ?? null,
    indicator_id: indicator.id,
  });
}

// Aliases mantidos para código existente
export const createBscObjective = createObjective;
export const deleteBscObjective = deleteObjective;
export const createBscMeasure = createKeyResult;
export const deleteBscMeasure = deleteKeyResult;
