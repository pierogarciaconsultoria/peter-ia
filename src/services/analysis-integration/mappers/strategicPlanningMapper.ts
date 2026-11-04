import {
  BscObjectiveMapping,
  BusinessModelCanvasMapping,
  StrategicPlanningMapping,
  StrategyPillarMapping,
  SwotItemMapping,
} from '@/types/analysis-integration';

const SWOT_KEYS: Array<[string, SwotItemMapping['category']]> = [
  ['strengths', 'strength'],
  ['weaknesses', 'weakness'],
  ['opportunities', 'opportunity'],
  ['threats', 'threat'],
];

const PERSPECTIVES: BscObjectiveMapping['perspective'][] = ['financial', 'customer', 'internal_process', 'learning_growth'];

const PERSPECTIVE_ALIASES: Record<string, BscObjectiveMapping['perspective']> = {
  financial: 'financial', financeira: 'financial', financeiro: 'financial', finance: 'financial',
  customer: 'customer', customers: 'customer', clientes: 'customer', cliente: 'customer', mercado: 'customer',
  internal_process: 'internal_process', internal: 'internal_process', processos: 'internal_process',
  processos_internos: 'internal_process', 'processos internos': 'internal_process', process: 'internal_process',
  learning_growth: 'learning_growth', learning: 'learning_growth', aprendizado: 'learning_growth',
  'aprendizado e crescimento': 'learning_growth', aprendizado_crescimento: 'learning_growth', growth: 'learning_growth',
};

const CANVAS_FIELDS: (keyof BusinessModelCanvasMapping)[] = [
  'key_partners', 'key_activities', 'key_resources', 'value_propositions', 'customer_relationships',
  'channels', 'customer_segments', 'cost_structure', 'revenue_streams',
];

function asText(value: any): string {
  if (value == null) return '';
  if (typeof value === 'string') return value.trim();
  if (Array.isArray(value)) return value.map(asText).filter(Boolean).join('; ');
  if (typeof value === 'object') return asText(value.description || value.text || value.title || Object.values(value));
  return String(value);
}

function clampImpact(value: any): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return 3;
  return Math.min(5, Math.max(1, Math.round(n)));
}

function normalizePerspective(raw: any): BscObjectiveMapping['perspective'] | null {
  const key = asText(raw).toLowerCase().replace(/-/g, '_');
  return PERSPECTIVE_ALIASES[key] || null;
}

function normalizeGoalType(raw: any): NonNullable<BscObjectiveMapping['measure']>['goal_type'] {
  const value = asText(raw).toLowerCase();
  if (value.includes('lower') || value.includes('menor')) return 'lower_better';
  if (value === 'target' || value.includes('espec')) return 'target';
  return 'higher_better';
}

export class StrategicPlanningMapper {
  static mapStrategicPlanning(aiSuggestions: any): StrategicPlanningMapping {
    const strategic = aiSuggestions?.strategic_planning || {};

    return {
      mission: asText(strategic.mission),
      vision: asText(strategic.vision),
      values: StrategicPlanningMapper.mapValues(strategic.values),
      ultimate_goal: asText(strategic.ultimate_goal || aiSuggestions?.ultimate_goal),
      pillars: StrategicPlanningMapper.mapPillars(strategic.pillars || aiSuggestions?.pillars || aiSuggestions?.strategy_pillars),
      swot_items: StrategicPlanningMapper.mapSwot(strategic.swot || aiSuggestions?.swot || aiSuggestions?.swot_analysis),
      bsc_objectives: StrategicPlanningMapper.mapBsc(strategic.bsc_objectives || strategic.bsc || aiSuggestions?.bsc_objectives || aiSuggestions?.bsc),
      canvas: StrategicPlanningMapper.mapCanvas(strategic.business_model_canvas || aiSuggestions?.business_model_canvas || aiSuggestions?.canvas),
    };
  }

  static mapValues(raw: any): string[] {
    if (!Array.isArray(raw)) return raw ? asText(raw).split(/[;,]/).map(v => v.trim()).filter(Boolean) : [];
    return raw
      .map((v: any) => (typeof v === 'string' ? v : v?.name || v?.value || v?.title || asText(v)))
      .map((v: string) => v.trim())
      .filter(Boolean);
  }

  static mapPillars(raw: any): StrategyPillarMapping[] {
    if (!Array.isArray(raw)) return [];
    return raw
      .map((entry: any): StrategyPillarMapping | null => {
        const name = asText(typeof entry === 'string' ? entry : entry?.name || entry?.title);
        if (!name) return null;
        return {
          name,
          description: typeof entry === 'string' ? '' : asText(entry?.description),
          bsc_perspective: normalizePerspective(entry?.bsc_perspective || entry?.perspective),
        };
      })
      .filter((p: StrategyPillarMapping | null): p is StrategyPillarMapping => p !== null)
      .slice(0, 5);
  }

  static mapSwot(raw: any): SwotItemMapping[] {
    if (!raw) return [];
    const items: SwotItemMapping[] = [];

    if (Array.isArray(raw)) {
      // Formato plano: [{ category, description, impact_level }]
      for (const entry of raw) {
        const category = SWOT_KEYS.find(([k, c]) => k === entry?.category || c === entry?.category)?.[1];
        const description = asText(entry?.description || entry?.item || entry);
        if (category && description) items.push({ category, description, impact_level: clampImpact(entry?.impact_level) });
      }
      return items;
    }

    for (const [key, category] of SWOT_KEYS) {
      const list = raw[key] || raw[category] || [];
      for (const entry of Array.isArray(list) ? list : [list]) {
        const description = asText(typeof entry === 'string' ? entry : entry?.description || entry?.item || entry?.title);
        if (description) items.push({ category, description, impact_level: clampImpact(entry?.impact_level ?? entry?.impact) });
      }
    }
    return items;
  }

  static mapBsc(raw: any): BscObjectiveMapping[] {
    if (!raw) return [];
    const objectives: BscObjectiveMapping[] = [];

    const push = (entry: any, fallbackPerspective?: BscObjectiveMapping['perspective']) => {
      const perspective = normalizePerspective(entry?.perspective) || fallbackPerspective;
      const title = asText(entry?.title || entry?.objective || entry?.name);
      if (!perspective || !title) return;

      const rawMeasure = entry?.measure || entry?.kpi || entry?.indicator;
      const measureName = asText(rawMeasure?.name || rawMeasure?.title || (typeof rawMeasure === 'string' ? rawMeasure : ''));
      const target = Number(rawMeasure?.target ?? rawMeasure?.goal_value ?? rawMeasure?.goal);
      const startValue = Number(rawMeasure?.start_value ?? rawMeasure?.initial_value ?? rawMeasure?.current_value);

      objectives.push({
        perspective,
        title,
        description: asText(entry?.description),
        measure: measureName
          ? {
              name: measureName,
              start_value: Number.isFinite(startValue) ? startValue : 0,
              target: Number.isFinite(target) ? target : 100,
              unit: asText(rawMeasure?.unit) || '%',
              goal_type: normalizeGoalType(rawMeasure?.goal_type),
            }
          : undefined,
      });
    };

    if (Array.isArray(raw)) {
      raw.forEach(entry => push(entry));
    } else if (typeof raw === 'object') {
      // Formato agrupado: { financial: [...], customer: [...], ... }
      for (const [key, list] of Object.entries(raw)) {
        const perspective = normalizePerspective(key);
        if (!perspective) continue;
        (Array.isArray(list) ? list : [list]).forEach(entry => push(entry, perspective));
      }
    }

    // Mantém a ordem das perspectivas
    return PERSPECTIVES.flatMap(p => objectives.filter(o => o.perspective === p));
  }

  static mapCanvas(raw: any): BusinessModelCanvasMapping | null {
    if (!raw || typeof raw !== 'object') return null;
    const canvas = {} as BusinessModelCanvasMapping;
    let filled = 0;
    for (const field of CANVAS_FIELDS) {
      const text = asText(raw[field]);
      canvas[field] = text;
      if (text) filled++;
    }
    return filled > 0 ? canvas : null;
  }
}
