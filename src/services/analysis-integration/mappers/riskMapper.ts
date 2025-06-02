
import { RiskMapping } from '@/types/analysis-integration';

export class RiskMapper {
  static mapRisks(aiSuggestions: any): RiskMapping[] {
    const risks = aiSuggestions.risk_analysis || [];
    
    return risks.map((risk: any, index: number) => ({
      title: risk.title || risk.name || `Risco ${index + 1}`,
      description: risk.description || risk.risk || risk,
      category: risk.category || 'Operacional',
      process: risk.process || 'Geral',
      probability: risk.probability || 3,
      impact: risk.impact || 3,
      mitigation_plan: risk.mitigation || risk.mitigation_plan || 'Plano de mitigação a ser definido',
      responsible: risk.responsible || 'A definir',
      status: 'active' as const
    }));
  }
}
