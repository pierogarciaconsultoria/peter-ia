
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
  swot_items: SwotItemMapping[];
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
  calculation_type: 'sum' | 'average' | 'percentage';
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
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  responsible: string;
  status: 'pending' | 'in_progress' | 'completed';
}
