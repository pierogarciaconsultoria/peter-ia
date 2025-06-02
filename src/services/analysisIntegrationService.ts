
import { supabase } from '@/integrations/supabase/client';
import { 
  AnalysisIntegrationOptions, 
  IntegrationPreview,
  StrategicPlanningMapping,
  RiskMapping,
  IndicatorMapping,
  OrganizationContextMapping,
  ProcessMapping,
  ActionPlanMapping
} from '@/types/analysis-integration';
import { createRisk } from '@/services/riskService';
import { createOrganizationContext } from '@/services/organizationContextService';
import { createIndicator } from '@/services/indicatorService';
import { updateStrategicIdentity } from '@/services/strategic-planning/strategicIdentityService';
import { createSwotItem } from '@/services/strategic-planning/swotService';

export class AnalysisIntegrationService {
  
  static mapStrategicPlanning(aiSuggestions: any): StrategicPlanningMapping {
    const strategic = aiSuggestions.strategic_planning || {};
    
    return {
      mission: strategic.mission || '',
      vision: strategic.vision || '',
      values: strategic.values || [],
      swot_items: []
    };
  }

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

  static mapIndicators(aiSuggestions: any): IndicatorMapping[] {
    const kpis = aiSuggestions.kpis || [];
    
    return kpis.map((kpi: any) => ({
      name: kpi.name || kpi.title || kpi.indicator,
      description: kpi.description || kpi.objective || `Indicador para ${kpi.name}`,
      process: kpi.process || 'Estratégico',
      goal_type: 'higher_better' as const,
      goal_value: kpi.target || kpi.goal || 100,
      calculation_type: 'average' as const,
      unit: kpi.unit || '%'
    }));
  }

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

  static mapProcesses(aiSuggestions: any, companyData: any): ProcessMapping[] {
    const processes: ProcessMapping[] = [];
    
    // Processos baseados no setor da empresa
    const sector = companyData.company_sector || 'Geral';
    const defaultProcesses = this.getDefaultProcessesBySector(sector);
    
    defaultProcesses.forEach((process, index) => {
      processes.push({
        name: process.name,
        description: process.description,
        objective: process.objective,
        processType: 'Operacional',
        owner: 'A definir',
        status: 'Ativo',
        version: '1.0'
      });
    });

    return processes;
  }

  static mapActionPlan(aiSuggestions: any): ActionPlanMapping[] {
    const actionPlan = aiSuggestions.action_plan || [];
    
    return actionPlan.map((action: any) => ({
      title: action.title || action.action || action,
      description: action.description || action.details || `Ação: ${action.title || action}`,
      due_date: action.due_date || this.getDefaultDueDate(action.priority),
      priority: action.priority || 'medium',
      responsible: action.responsible || 'A definir',
      status: 'pending' as const
    }));
  }

  static async applyStrategicPlanning(mapping: StrategicPlanningMapping, companyId: string): Promise<boolean> {
    try {
      // Aplicar identidade estratégica
      await updateStrategicIdentity({
        mission: mapping.mission,
        vision: mapping.vision,
        values: mapping.values
      });

      // Aplicar itens SWOT se houver
      for (const swotItem of mapping.swot_items) {
        await createSwotItem(swotItem);
      }

      return true;
    } catch (error) {
      console.error('Erro ao aplicar planejamento estratégico:', error);
      return false;
    }
  }

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

  static async applyOrganizationContext(contexts: OrganizationContextMapping[], companyId: string): Promise<boolean> {
    try {
      for (const context of contexts) {
        await createOrganizationContext(context);
      }
      return true;
    } catch (error) {
      console.error('Erro ao aplicar contexto da organização:', error);
      return false;
    }
  }

  static async applyProcesses(processes: ProcessMapping[], companyId: string): Promise<boolean> {
    try {
      // Implementar criação de processos quando necessário
      console.log('Aplicação de processos em desenvolvimento');
      return true;
    } catch (error) {
      console.error('Erro ao aplicar processos:', error);
      return false;
    }
  }

  static async applyActionPlan(actions: ActionPlanMapping[], companyId: string): Promise<boolean> {
    try {
      // Implementar criação de plano de ação quando necessário
      console.log('Aplicação de plano de ação em desenvolvimento');
      return true;
    } catch (error) {
      console.error('Erro ao aplicar plano de ação:', error);
      return false;
    }
  }

  private static getDefaultProcessesBySector(sector: string) {
    const processMap: Record<string, any[]> = {
      'Tecnologia': [
        { name: 'Desenvolvimento de Software', description: 'Processo de desenvolvimento de produtos de software', objective: 'Entregar software de qualidade' },
        { name: 'Suporte Técnico', description: 'Atendimento e suporte aos clientes', objective: 'Resolver problemas técnicos rapidamente' }
      ],
      'Manufatura': [
        { name: 'Produção', description: 'Processo de fabricação de produtos', objective: 'Produzir com qualidade e eficiência' },
        { name: 'Controle de Qualidade', description: 'Verificação da qualidade dos produtos', objective: 'Garantir padrões de qualidade' }
      ],
      'Serviços': [
        { name: 'Atendimento ao Cliente', description: 'Processo de atendimento e relacionamento', objective: 'Satisfazer as necessidades dos clientes' },
        { name: 'Prestação de Serviços', description: 'Execução dos serviços contratados', objective: 'Entregar serviços de excelência' }
      ]
    };

    return processMap[sector] || [
      { name: 'Processo Principal', description: 'Processo core da organização', objective: 'Atingir os objetivos organizacionais' }
    ];
  }

  private static getDefaultDueDate(priority: string): string {
    const now = new Date();
    switch (priority) {
      case 'high':
        now.setMonth(now.getMonth() + 1);
        break;
      case 'medium':
        now.setMonth(now.getMonth() + 3);
        break;
      default:
        now.setMonth(now.getMonth() + 6);
    }
    return now.toISOString().split('T')[0];
  }

  static generatePreviews(aiSuggestions: any, companyData: any): IntegrationPreview[] {
    const previews: IntegrationPreview[] = [];

    // Preview Planejamento Estratégico
    const strategicMapping = this.mapStrategicPlanning(aiSuggestions);
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
    const risksMapping = this.mapRisks(aiSuggestions);
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
    const indicatorsMapping = this.mapIndicators(aiSuggestions);
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
    const contextMapping = this.mapOrganizationContext(aiSuggestions);
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
