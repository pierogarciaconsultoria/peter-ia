
import { IntegrationPreview } from '@/types/analysis-integration';
import { StrategicPlanningMapper } from './mappers/strategicPlanningMapper';
import { RiskMapper } from './mappers/riskMapper';
import { IndicatorMapper } from './mappers/indicatorMapper';
import { OrganizationContextMapper } from './mappers/organizationContextMapper';
import { ProcessMapper } from './mappers/processMapper';
import { ActionPlanMapper } from './mappers/actionPlanMapper';
import { StrategicPlanningApplication } from './applications/strategicPlanningApplication';
import { RiskApplication } from './applications/riskApplication';
import { IndicatorApplication } from './applications/indicatorApplication';
import { OrganizationContextApplication } from './applications/organizationContextApplication';
import { ProcessApplication } from './applications/processApplication';
import { ActionPlanApplication } from './applications/actionPlanApplication';
import { PreviewGenerator } from './previewGenerator';

export class AnalysisIntegrationService {
  
  static mapStrategicPlanning = StrategicPlanningMapper.mapStrategicPlanning;
  static mapRisks = RiskMapper.mapRisks;
  static mapIndicators = IndicatorMapper.mapIndicators;
  static mapOrganizationContext = OrganizationContextMapper.mapOrganizationContext;
  static mapProcesses = ProcessMapper.mapProcesses;
  static mapActionPlan = ActionPlanMapper.mapActionPlan;

  static applyStrategicPlanning = StrategicPlanningApplication.applyStrategicPlanning;
  static applyRisks = RiskApplication.applyRisks;
  static applyIndicators = IndicatorApplication.applyIndicators;
  static applyOrganizationContext = OrganizationContextApplication.applyOrganizationContext;
  static applyProcesses = ProcessApplication.applyProcesses;
  static applyActionPlan = ActionPlanApplication.applyActionPlan;

  static generatePreviews = PreviewGenerator.generatePreviews;
}
