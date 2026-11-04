import { Tables } from "@/integrations/supabase/types";

export type StrategicSource = 'manual' | 'ai' | 'questionnaire';

export type StrategicIdentity = Omit<Tables<'strategic_identities'>, 'source'> & { source: StrategicSource };

export type SwotCategory = 'strength' | 'weakness' | 'opportunity' | 'threat';
export type SwotItem = Omit<Tables<'swot_items'>, 'category' | 'source'> & { category: SwotCategory; source: 'manual' | 'ai' };

export type BscPerspectiveKey = 'financial' | 'customer' | 'internal_process' | 'learning_growth';

export const BSC_PERSPECTIVES: BscPerspectiveKey[] = ['financial', 'customer', 'internal_process', 'learning_growth'];

export const BSC_PERSPECTIVE_LABELS: Record<BscPerspectiveKey, string> = {
  financial: 'Financeira',
  customer: 'Clientes',
  internal_process: 'Processos Internos',
  learning_growth: 'Aprendizado e Crescimento',
};

export type ObjectiveStatus = 'active' | 'closed' | 'cancelled';

export const OBJECTIVE_STATUS_LABELS: Record<ObjectiveStatus, string> = {
  active: 'Ativo',
  closed: 'Encerrado',
  cancelled: 'Cancelado',
};

/** Resultado-chave (linha de bsc_measures). `progress` é calculado pelo banco. */
export type BscMeasure = Tables<'bsc_measures'>;
export type KeyResult = BscMeasure;

/** Objetivo (linha de bsc_objectives) com seus resultados-chave e progresso médio. */
export type BscObjective = Omit<Tables<'bsc_objectives'>, 'perspective' | 'status' | 'source'> & {
  perspective: BscPerspectiveKey | null;
  status: ObjectiveStatus;
  source: 'manual' | 'ai';
  measures: BscMeasure[];
  /** Média do progresso dos resultados-chave (0 a 1), ou null sem resultados-chave mensuráveis. */
  progress: number | null;
};
export type Objective = BscObjective;

/** Agrupamento por perspectiva BSC (usado no relatório PDF e no plano de ação). */
export interface BscPerspective {
  id: string;
  perspective: BscPerspectiveKey;
  objectives: BscObjective[];
  created_at: string;
  updated_at: string;
}

export type BusinessModelCanvas = Omit<Tables<'business_model_canvas'>, 'source'> & { source: 'manual' | 'ai' };

export type BusinessModelCanvasFields = Omit<BusinessModelCanvas, 'id' | 'company_id' | 'source' | 'created_at' | 'updated_at'>;

/** Progresso médio dos resultados-chave de um objetivo. */
export function objectiveProgress(measures: Pick<BscMeasure, 'progress'>[]): number | null {
  const values = measures.map(m => m.progress).filter((p): p is number => p !== null && p !== undefined);
  if (values.length === 0) return null;
  return values.reduce((sum, p) => sum + Number(p), 0) / values.length;
}
