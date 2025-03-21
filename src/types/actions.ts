
export type ActionStatus = 'planned' | 'in_progress' | 'completed' | 'delayed' | 'cancelled';
export type ActionPriority = 'low' | 'medium' | 'high' | 'critical';
export type ProcessArea = 'manufacturing' | 'quality' | 'management' | 'hr' | 'sales' | 'supply_chain' | 'other';
export type ActionSource = 'planning' | 'audit' | 'non_conformity' | 'corrective_action' | 'critical_analysis' | 'customer_satisfaction' | 'supplier_evaluation' | 'customer_complaint' | 'other';

export interface Action5W2H {
  id: string;
  title: string;
  // Source
  source: ActionSource;
  // What
  what: string;
  // Why
  why: string;
  // Where
  where: string;
  // When
  due_date: string;
  start_date?: string;
  // Who
  responsible: string;
  involved_people?: string;
  // How
  how: string;
  // How Much
  how_much: number | null;
  currency?: string;
  
  // Additional fields
  status: ActionStatus;
  priority: ActionPriority;
  process_area: ProcessArea;
  created_at: string;
  updated_at?: string;
  completed_at?: string;
  comments?: string;
}
