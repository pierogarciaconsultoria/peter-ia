
import { IndicatorMapping } from '@/types/analysis-integration';
import { isValidCalculationType } from '../validationUtils';

export class IndicatorMapper {
  static mapIndicators(aiSuggestions: any): IndicatorMapping[] {
    const kpis = aiSuggestions.kpis || [];
    
    return kpis.map((kpi: any) => {
      // Validate and apply fallback for calculation_type
      const rawCalculationType = kpi.calculation_type || 'average';
      const calculationType = isValidCalculationType(rawCalculationType) ? rawCalculationType : 'average';

      return {
        name: kpi.name || kpi.title || kpi.indicator,
        description: kpi.description || kpi.objective || `Indicador para ${kpi.name}`,
        process: kpi.process || 'Estratégico',
        goal_type: 'higher_better' as const,
        goal_value: kpi.target || kpi.goal || 100,
        calculation_type: calculationType,
        unit: kpi.unit || '%'
      };
    });
  }
}
