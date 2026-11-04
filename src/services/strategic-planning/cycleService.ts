import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

export type CycleType = 'annual' | 'quarterly';
export type CycleStatus = 'planned' | 'active' | 'closed';
export type Cycle = Omit<Tables<'cycles'>, 'type' | 'status'> & { type: CycleType; status: CycleStatus };
export type CycleInput = Omit<TablesInsert<'cycles'>, 'id' | 'company_id' | 'created_at' | 'updated_at'>;

export const CYCLE_TYPE_LABELS: Record<Cycle['type'], string> = {
  annual: 'Anual',
  quarterly: 'Trimestral',
};

export const CYCLE_STATUS_LABELS: Record<Cycle['status'], string> = {
  planned: 'Planejado',
  active: 'Ativo',
  closed: 'Encerrado',
};

export async function getCycles(): Promise<Cycle[]> {
  const { data, error } = await supabase
    .from('cycles')
    .select('*')
    .order('start_date', { ascending: false });
  if (error) {
    console.error("Error fetching cycles:", error);
    throw new Error(error.message);
  }
  return (data ?? []) as Cycle[];
}

/**
 * Garante que a empresa tenha um ciclo anual vigente (cria se não houver)
 * e devolve o id. Usa a função do banco, que roda com privilégios elevados.
 */
export async function ensureDefaultCycle(companyId: string): Promise<string> {
  const { data, error } = await supabase.rpc('ensure_default_cycle', { p_company: companyId });
  if (error) {
    console.error("Error ensuring default cycle:", error);
    throw new Error(error.message);
  }
  return data as string;
}

/** Ciclo preferido para novos objetivos: o ativo mais recente, senão o anual padrão. */
export async function getCurrentCycle(companyId: string): Promise<Cycle | null> {
  const cycles = await getCycles();
  const today = new Date().toISOString().slice(0, 10);
  const current = cycles.find(c => c.status === 'active' && c.start_date <= today && c.end_date >= today);
  if (current) return current;
  const id = await ensureDefaultCycle(companyId);
  return (await getCycles()).find(c => c.id === id) ?? null;
}

export async function createCycle(input: CycleInput): Promise<Cycle> {
  const { data, error } = await supabase.from('cycles').insert(input).select().single();
  if (error) {
    console.error("Error creating cycle:", error);
    throw new Error(error.message);
  }
  return data as Cycle;
}

export async function updateCycle(id: string, input: Partial<CycleInput>): Promise<Cycle> {
  const { data, error } = await supabase.from('cycles').update(input).eq('id', id).select().single();
  if (error) {
    console.error("Error updating cycle:", error);
    throw new Error(error.message);
  }
  return data as Cycle;
}

/** Sugestão de trimestre a partir de uma data. */
export function quarterFor(date = new Date()): CycleInput {
  const q = Math.floor(date.getMonth() / 3);
  const year = date.getFullYear();
  const start = new Date(year, q * 3, 1);
  const end = new Date(year, q * 3 + 3, 0);
  return {
    name: `${q + 1}º Trimestre ${year}`,
    type: 'quarterly',
    start_date: start.toISOString().slice(0, 10),
    end_date: end.toISOString().slice(0, 10),
    status: 'active',
  };
}
