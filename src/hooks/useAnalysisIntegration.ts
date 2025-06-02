import { useState } from 'react';
import { AnalysisIntegrationService } from '@/services/analysis-integration/analysisIntegrationService';
import { IntegrationPreview, AnalysisIntegrationOptions } from '@/types/analysis-integration';
import { useCurrentUser } from './useCurrentUser';
import { toast } from 'sonner';

export function useAnalysisIntegration() {
  const { empresaId } = useCurrentUser();
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState<IntegrationPreview[]>([]);
  const [integrationOptions, setIntegrationOptions] = useState<AnalysisIntegrationOptions>({
    strategic_planning: true,
    organization_context: true,
    risk_management: true,
    indicators: true,
    processes: false,
    action_plan: false
  });

  const generatePreviews = (aiSuggestions: any, companyData: any) => {
    try {
      const generatedPreviews = AnalysisIntegrationService.generatePreviews(aiSuggestions, companyData);
      setPreviews(generatedPreviews);
      return generatedPreviews;
    } catch (error) {
      console.error('Erro ao gerar previews:', error);
      toast.error('Erro ao gerar previews de integração');
      return [];
    }
  };

  const applyIntegration = async (moduleType: string, aiSuggestions: any, companyData: any) => {
    if (!empresaId) {
      toast.error('Empresa não identificada');
      return false;
    }

    setLoading(true);
    try {
      let success = false;

      switch (moduleType) {
        case 'strategic_planning':
          const strategicMapping = AnalysisIntegrationService.mapStrategicPlanning(aiSuggestions);
          success = await AnalysisIntegrationService.applyStrategicPlanning(strategicMapping, empresaId);
          break;

        case 'risk_management':
          const risksMapping = AnalysisIntegrationService.mapRisks(aiSuggestions);
          success = await AnalysisIntegrationService.applyRisks(risksMapping, empresaId);
          break;

        case 'indicators':
          const indicatorsMapping = AnalysisIntegrationService.mapIndicators(aiSuggestions);
          success = await AnalysisIntegrationService.applyIndicators(indicatorsMapping, empresaId);
          break;

        case 'organization_context':
          const contextMapping = AnalysisIntegrationService.mapOrganizationContext(aiSuggestions);
          success = await AnalysisIntegrationService.applyOrganizationContext(contextMapping, empresaId);
          break;

        case 'processes':
          const processesMapping = AnalysisIntegrationService.mapProcesses(aiSuggestions, companyData);
          success = await AnalysisIntegrationService.applyProcesses(processesMapping, empresaId);
          break;

        case 'action_plan':
          const actionPlanMapping = AnalysisIntegrationService.mapActionPlan(aiSuggestions);
          success = await AnalysisIntegrationService.applyActionPlan(actionPlanMapping, empresaId);
          break;

        default:
          toast.error('Tipo de módulo não suportado');
          return false;
      }

      if (success) {
        toast.success(`${getModuleDisplayName(moduleType)} aplicado com sucesso!`);
        return true;
      } else {
        toast.error(`Erro ao aplicar ${getModuleDisplayName(moduleType)}`);
        return false;
      }
    } catch (error) {
      console.error(`Erro ao aplicar integração ${moduleType}:`, error);
      toast.error(`Erro ao aplicar ${getModuleDisplayName(moduleType)}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const applyAllIntegrations = async (aiSuggestions: any, companyData: any) => {
    const enabledModules = Object.entries(integrationOptions)
      .filter(([_, enabled]) => enabled)
      .map(([module, _]) => module);

    let successCount = 0;
    
    for (const module of enabledModules) {
      const success = await applyIntegration(module, aiSuggestions, companyData);
      if (success) successCount++;
    }

    if (successCount === enabledModules.length) {
      toast.success('Todas as integrações foram aplicadas com sucesso!');
    } else if (successCount > 0) {
      toast.warning(`${successCount} de ${enabledModules.length} integrações aplicadas com sucesso`);
    } else {
      toast.error('Nenhuma integração foi aplicada com sucesso');
    }

    return successCount > 0;
  };

  const toggleIntegrationOption = (module: keyof AnalysisIntegrationOptions) => {
    setIntegrationOptions(prev => ({
      ...prev,
      [module]: !prev[module]
    }));
  };

  return {
    loading,
    previews,
    integrationOptions,
    generatePreviews,
    applyIntegration,
    applyAllIntegrations,
    toggleIntegrationOption
  };
}

function getModuleDisplayName(moduleType: string): string {
  const displayNames: Record<string, string> = {
    strategic_planning: 'Planejamento Estratégico',
    organization_context: 'Contexto da Organização',
    risk_management: 'Gestão de Riscos',
    indicators: 'Indicadores de Performance',
    processes: 'Processos',
    action_plan: 'Plano de Ação'
  };

  return displayNames[moduleType] || moduleType;
}
