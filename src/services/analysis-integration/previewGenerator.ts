
import { IntegrationPreview, IntegrationItem } from '@/types/analysis-integration';
import { StrategicPlanningMapper } from './mappers/strategicPlanningMapper';
import { RiskMapper } from './mappers/riskMapper';
import { IndicatorMapper } from './mappers/indicatorMapper';
import { OrganizationContextMapper } from './mappers/organizationContextMapper';
import { ActionPlanMapper } from './mappers/actionPlanMapper';

export class PreviewGenerator {
  static generatePreviews(aiSuggestions: any, companyData: any): IntegrationPreview[] {
    const previews: IntegrationPreview[] = [];

    // Preview Planejamento Estratégico (identidade, SWOT, BSC e Canvas)
    const strategicMapping = StrategicPlanningMapper.mapStrategicPlanning(aiSuggestions);
    const hasStrategic =
      strategicMapping.mission || strategicMapping.vision || strategicMapping.values.length > 0 || strategicMapping.ultimate_goal || strategicMapping.pillars.length > 0 ||
      strategicMapping.swot_items.length > 0 || strategicMapping.bsc_objectives.length > 0 || strategicMapping.canvas;
    if (hasStrategic) {
      const items: IntegrationItem[] = [];
      if (strategicMapping.mission) items.push({ id: 'mission', title: 'Missão', description: strategicMapping.mission, type: 'text', data: strategicMapping.mission });
      if (strategicMapping.vision) items.push({ id: 'vision', title: 'Visão', description: strategicMapping.vision, type: 'text', data: strategicMapping.vision });
      if (strategicMapping.ultimate_goal) items.push({ id: 'ultimate_goal', title: 'Objetivo final', description: strategicMapping.ultimate_goal, type: 'text', data: strategicMapping.ultimate_goal });
      if (strategicMapping.pillars.length > 0) items.push({ id: 'pillars', title: 'Pilares estratégicos', description: strategicMapping.pillars.map(p => p.name).join('; '), type: 'array', data: strategicMapping.pillars });
      if (strategicMapping.values.length > 0) items.push({ id: 'values', title: 'Valores', description: strategicMapping.values.join(', '), type: 'array', data: strategicMapping.values });
      if (strategicMapping.swot_items.length > 0) {
        items.push({
          id: 'swot',
          title: 'Análise SWOT',
          description: `${strategicMapping.swot_items.length} itens: ` + strategicMapping.swot_items.slice(0, 4).map(i => i.description).join('; ') + (strategicMapping.swot_items.length > 4 ? '…' : ''),
          type: 'swot',
          data: strategicMapping.swot_items
        });
      }
      if (strategicMapping.bsc_objectives.length > 0) {
        items.push({
          id: 'bsc',
          title: 'Objetivos (OKR)',
          description: `${strategicMapping.bsc_objectives.length} objetivos com resultado-chave: ` + strategicMapping.bsc_objectives.slice(0, 4).map(o => o.title).join('; ') + (strategicMapping.bsc_objectives.length > 4 ? '…' : ''),
          type: 'bsc',
          data: strategicMapping.bsc_objectives
        });
      }
      if (strategicMapping.canvas) {
        items.push({ id: 'canvas', title: 'Business Model Canvas', description: strategicMapping.canvas.value_propositions || '9 blocos preenchidos', type: 'canvas', data: strategicMapping.canvas });
      }
      previews.push({ module: 'strategic_planning', title: 'Planejamento Estratégico', canApply: true, items });
    }

    // Preview Plano de Ação (90 dias)
    const actionsMapping = ActionPlanMapper.mapActionPlan(aiSuggestions);
    if (actionsMapping.length > 0) {
      previews.push({
        module: 'action_plan',
        title: 'Plano de Ação (90 dias)',
        canApply: true,
        items: actionsMapping.map((action, index) => ({
          id: `action_${index}`,
          title: action.title,
          description: `${action.why} · prazo ${action.due_date} · prioridade ${action.priority}`,
          type: 'action',
          data: action
        }))
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
