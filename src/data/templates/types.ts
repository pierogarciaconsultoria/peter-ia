import { IndicatorType } from "@/types/indicators";

export type SegmentKey = 'industria' | 'servicos' | 'comercio' | 'construcao' | 'saude' | 'outro';

export interface TemplateProcess {
  /** Chave estável usada para ligar indicadores e riscos ao processo */
  key: string;
  name: string;
  type: 'Gestão' | 'Negócio' | 'Apoio';
  description: string;
  objective: string;
}

export interface TemplateIndicator {
  name: string;
  description: string;
  processKey: string;
  goal_type: IndicatorType['goal_type'];
  goal_value: number;
  unit: string;
  calculation_type: IndicatorType['calculation_type'];
}

export interface TemplateRisk {
  title: string;
  description: string;
  category: string;
  processKey: string;
  probability: number;
  impact: number;
  mitigation_plan: string;
}

export interface SegmentTemplate {
  key: SegmentKey;
  label: string;
  /** Subsegmentos sugeridos no onboarding (texto livre também é aceito) */
  subsegments: string[];
  processes: TemplateProcess[];
  indicators: TemplateIndicator[];
  risks: TemplateRisk[];
}
