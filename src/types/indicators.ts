export interface IndicatorType {
  id: string;
  name: string;
  description?: string;
  process: string;
  goal_type: 'higher_better' | 'lower_better' | 'target';
  goal_value: number;
  calculation_type: 'sum' | 'average';
  unit?: string;
  /** Responsável pelo KPI (user_profiles.id) */
  owner_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MeasurementType {
  id: string;
  indicator_id: string;
  month: number;
  year: number;
  value: number;
  /** Meta do mês (quando vazia, vale goal_value do indicador) */
  target?: number | null;
  notes?: string;
  created_at: string;
  updated_at: string;
}
