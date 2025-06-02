
import { IndicatorMapping } from '@/types/analysis-integration';
import { createIndicator } from '@/services/indicatorService';

export class IndicatorApplication {
  static async applyIndicators(indicators: IndicatorMapping[], companyId: string): Promise<boolean> {
    try {
      for (const indicator of indicators) {
        await createIndicator(indicator);
      }
      return true;
    } catch (error) {
      console.error('Erro ao aplicar indicadores:', error);
      return false;
    }
  }
}
