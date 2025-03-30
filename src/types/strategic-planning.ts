
export interface StrategicIdentity {
  id: string;
  mission: string;
  vision: string;
  values: string[];
  created_at: string;
  updated_at: string;
}

export interface SwotItem {
  id: string;
  category: 'strength' | 'weakness' | 'opportunity' | 'threat';
  description: string;
  impact_level: number; // 1-5 scale
  created_at: string;
  updated_at: string;
}

export interface BscPerspective {
  id: string;
  perspective: 'financial' | 'customer' | 'internal_process' | 'learning_growth';
  objectives: BscObjective[];
  created_at: string;
  updated_at: string;
}

export interface BscObjective {
  id: string;
  perspective_id: string;
  title: string;
  description: string;
  measures: BscMeasure[];
  created_at: string;
  updated_at: string;
}

export interface BscMeasure {
  id: string;
  objective_id: string;
  name: string;
  target: number;
  unit: string;
  current_value?: number;
  created_at: string;
  updated_at: string;
}

export interface BusinessModelCanvas {
  id: string;
  key_partners: string;
  key_activities: string;
  key_resources: string;
  value_propositions: string;
  customer_relationships: string;
  channels: string;
  customer_segments: string;
  cost_structure: string;
  revenue_streams: string;
  created_at: string;
  updated_at: string;
}
