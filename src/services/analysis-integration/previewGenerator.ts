
import { IntegrationPreview } from '@/types/analysis-integration';
import { StrategicPlanningMapper } from './mappers/strategicPlanningMapper';
import { RiskMapper } from './mappers/riskMapper';
import { IndicatorMapper } from './mappers/indicatorMapper';
import { OrganizationContextMapper } from './mappers/organizationContextMapper';

export class PreviewGenerator {
  static generatePreviews(aiSuggestions: any, companyData: any): IntegrationPreview[] {
    const previews: IntegrationPreview[] = [];

    // Preview Planejamento Estratégico
    const strategicMapping = StrategicPlanningMapper.mapStrategicPlanning(aiSuggestions);
    if (strategicMapping.mission || strategicMapping.vision || strategicMapping.values.length > 0) {
      previews.push({
        module: 'strategic_planning',
        title: 'Planejamento Estratégico',
        canApply: true,
        items: [
          { id: 'mission', title: 'Missão', description: strategicMapping.mission, type: 'text', data: strategicMapping.mission },
          { id: 'vision', title: 'Visão', description: strategicMapping.vision, type: 'text', data: strategicMapping.vision },
          { id: 'values', title: 'Valores', description: `${strategicMapping.values.length} valores`, type: 'array', data: strategicMapping.values }
        ]
      });
    }

    // Preview Riscos
    const risksMapping = RiskMapper.mapRisks(aiSuggestions);
    if (risksMapping.length > 0) {
      previews.push({
        module: 'risk_management',
        title: 'Gestão de Riscos',
        canApply: true,
        items: risksMapping.map((risk, index) => ({
          id: `risk_${index}`,
          title: risk.title,
          description: risk.description,
          type: 'risk',
          data: risk
        }))
      });
    }

    // Preview Indicadores
    const indicatorsMapping = IndicatorMapper.mapIndicators(aiSuggestions);
    if (indicatorsMapping.length > 0) {
      previews.push({
        module: 'indicators',
        title: 'Indicadores de Performance',
        canApply: true,
        items: indicatorsMapping.map((indicator, index) => ({
          id: `indicator_${index}`,
          title: indicator.name,
          description: indicator.description,
          type: 'indicator',
          data: indicator
        }))
      });
    }

    // Preview Contexto da Organização
    const contextMapping = OrganizationContextMapper.mapOrganizationContext(aiSuggestions);
    if (contextMapping.length > 0) {
      previews.push({
        module: 'organization_context',
        title: 'Contexto da Organização',
        canApply: true,
        items: contextMapping.map((context, index) => ({
          id: `context_${index}`,
          title: context.context_type === 'internal_factor' ? 'Fator Interno' : 'Fator Externo',
          description: context.description,
          type: 'context',
          data: context
        }))
      });
    }

    return previews;
  }
}
