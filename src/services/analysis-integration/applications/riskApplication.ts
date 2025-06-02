
import { RiskMapping } from '@/types/analysis-integration';
import { createRisk } from '@/services/riskService';

export class RiskApplication {
  static async applyRisks(risks: RiskMapping[], companyId: string): Promise<boolean> {
    try {
      for (const risk of risks) {
        await createRisk(risk);
      }
      return true;
    } catch (error) {
      console.error('Erro ao aplicar riscos:', error);
      return false;
    }
  }
}
