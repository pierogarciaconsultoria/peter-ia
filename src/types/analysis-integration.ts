
export interface AnalysisIntegrationOptions {
  strategic_planning: boolean;
  organization_context: boolean;
  risk_management: boolean;
  indicators: boolean;
  processes: boolean;
  action_plan: boolean;
}

export interface IntegrationPreview {
  module: string;
  title: string;
  items: IntegrationItem[];
  canApply: boolean;
}

export interface IntegrationItem {
  id: string;
  title: string;
  description: string;
  type: string;
  data: any;
}

export interface StrategicPlanningMapping {
  mission: string;
  vision: string;
  values: string[];
  ultimate_goal: string;
  pillars: StrategyPillarMapping[];
  swot_items: SwotItemMapping[];
  bsc_objectives: BscObjectiveMapping[];
  canvas: BusinessModelCanvasMapping | null;
}

export interface StrategyPillarMapping {
  name: string;
  description: string;
  bsc_perspective?: 'financial' | 'customer' | 'internal_process' | 'learning_growth' | null;
}

export interface BscObjectiveMapping {
  perspective: 'financial' | 'customer' | 'internal_process' | 'learning_growth';
  title: string;
  description: string;
  measure?: {
    name: string;
    start_value?: number;
    target: number;
    unit: string;
    goal_type: 'higher_better' | 'lower_better' | 'target';
  };
}

export interface BusinessModelCanvasMapping {
  key_partners: string;
  key_activities: string;
  key_resources: string;
  value_propositions: string;
  customer_relationships: string;
  channels: string;
  customer_segments: string;
  cost_structure: string;
  revenue_streams: string;
}

export interface ApplyStrategicPlanningOptions {
  /** Sobrescreve identidade e canvas já preenchidos. Padrão: só preenche o que está vazio. */
  overwrite?: boolean;
}

export interface SwotItemMapping {
  category: 'strength' | 'weakness' | 'opportunity' | 'threat';
  description: string;
  impact_level: number;
}

export interface RiskMapping {
  title: string;
  description: string;
  category: string;
  process: string;
  probability: number;
  impact: number;
  mitigation_plan: string;
  responsible: string;
  status: 'active' | 'mitigated' | 'inactive';
}

export interface IndicatorMapping {
  name: string;
  description: string;
  process: string;
  goal_type: 'higher_better' | 'lower_better' | 'target';
  goal_value: number;
  calculation_type: 'sum' | 'average';
  unit: string;
}

export interface OrganizationContextMapping {
  context_type: 'internal_factor' | 'external_factor' | 'interested_party' | 'swot';
  swot_category?: 'strength' | 'weakness' | 'opportunity' | 'threat';
  description: string;
  analysis: string;
  created_by: string;
  update_date: string;
}

export interface ProcessMapping {
  name: string;
  description: string;
  objective: string;
  processType: string;
  owner: string;
  status: string;
  version: string;
}

export interface ActionPlanMapping {
  title: string;
  description: string;
  what: string;
  why: string;
  how: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  responsible: string;
  process_area: 'manufacturing' | 'quality' | 'management' | 'hr' | 'sales' | 'supply_chain' | 'other';
  status: 'pending' | 'in_progress' | 'completed';
}
