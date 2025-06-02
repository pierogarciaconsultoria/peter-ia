
import { OrganizationContextMapping } from '@/types/analysis-integration';

export class OrganizationContextMapper {
  static mapOrganizationContext(aiSuggestions: any): OrganizationContextMapping[] {
    const contexts: OrganizationContextMapping[] = [];
    
    // Fatores internos dos riscos
    const risks = aiSuggestions.risk_analysis || [];
    risks.forEach((risk: any) => {
      if (risk.type === 'internal' || !risk.type) {
        contexts.push({
          context_type: 'internal_factor',
          description: risk.title || risk.description || risk,
          analysis: risk.analysis || 'Análise gerada pela IA',
          created_by: 'Sistema IA',
          update_date: new Date().toISOString().split('T')[0]
        });
      }
    });

    // Oportunidades de melhoria como fatores externos
    const opportunities = aiSuggestions.improvement_opportunities || [];
    opportunities.forEach((opp: any) => {
      contexts.push({
        context_type: 'external_factor',
        description: opp.title || opp.description || opp,
        analysis: opp.analysis || 'Oportunidade identificada pela análise inteligente',
        created_by: 'Sistema IA',
        update_date: new Date().toISOString().split('T')[0]
      });
    });

    return contexts;
  }
}
