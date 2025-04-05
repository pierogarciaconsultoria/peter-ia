
export type ActionStatus = 'planned' | 'in_progress' | 'completed' | 'delayed' | 'cancelled';
export type ActionPriority = 'low' | 'medium' | 'high' | 'critical';
export type ProcessArea = 'Comercial' | 'Financeiro' | 'Produção' | 'Qualidade' | 'RH' | 'TI' | 'Logística' | 'Compras' | 'Treinamento' | 'Administrativo' | string;
export type ActionSource = 
  | 'internal_audit' 
  | 'external_audit' 
  | 'customer_complaint' 
  | 'non_conformity' 
  | 'improvement_opportunity' 
  | 'management_review' 
  | 'strategic_planning' 
  | 'risk_management' 
  | 'planning'
  | 'audit'
  | 'corrective_action'
  | 'critical_analysis'
  | 'customer_satisfaction'
  | 'supplier_evaluation'
  | 'performance_indicator'
  | 'other';

export interface Action5W2H {
  id: string;
  title: string;
  what: string;
  why: string;
  where: string;
  when?: string;
  who?: string;
  how: string;
  responsible: string;
  how_much: number;
  currency?: string;
  due_date: string;
  start_date?: string;
  created_at?: string;
  updated_at?: string;
  completed_at?: string;
  status: ActionStatus;
  priority: ActionPriority;
  process_area: ProcessArea;
  source?: ActionSource;
  comments?: string;
  involved_people?: string;
}
