import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { getSegmentTemplate, SEGMENT_SECTOR_LABEL, SegmentKey, TemplateProcess } from "@/data/templates";
import { StrategicPlanningMapper } from "@/services/analysis-integration/mappers/strategicPlanningMapper";
import { RiskMapper } from "@/services/analysis-integration/mappers/riskMapper";
import { IndicatorMapper } from "@/services/analysis-integration/mappers/indicatorMapper";
import { ActionPlanMapper } from "@/services/analysis-integration/mappers/actionPlanMapper";
import { StrategicPlanningApplication } from "@/services/analysis-integration/applications/strategicPlanningApplication";
import { ActionPlanApplication } from "@/services/analysis-integration/applications/actionPlanApplication";
import { ActionPlanMapping, BscObjectiveMapping, BusinessModelCanvasMapping, StrategyPillarMapping, SwotItemMapping } from "@/types/analysis-integration";
import { ensureProcesses } from "@/services/processService";
import { addIndicator, getAllIndicators } from "@/services/indicatorService";
import { createRisk, getRisks } from "@/services/riskService";
import { IndicatorType } from "@/types/indicators";

export interface OnboardingCompanyInput {
  name: string;
  segment: SegmentKey;
  subsegment: string;
  company_size: string;
  company_description: string;
  operational_problems: string;
  business_objectives: string;
  company_website: string;
  company_instagram: string;
}

export interface ProposedProcess extends TemplateProcess { included: boolean }

export interface ProposedIndicator {
  name: string;
  description: string;
  processKey: string | null;
  processName: string;
  goal_type: IndicatorType['goal_type'];
  goal_value: number;
  unit: string;
  calculation_type: IndicatorType['calculation_type'];
  origin: 'template' | 'ai';
  included: boolean;
}

export interface ProposedRisk {
  title: string;
  description: string;
  category: string;
  processKey: string | null;
  processName: string;
  probability: number;
  impact: number;
  mitigation_plan: string;
  origin: 'template' | 'ai';
  included: boolean;
}

export interface OnboardingProposal {
  mission: string;
  vision: string;
  values: string[];
  ultimate_goal: string;
  pillars: (StrategyPillarMapping & { included: boolean })[];
  swot: (SwotItemMapping & { included: boolean })[];
  objectives: (BscObjectiveMapping & { included: boolean })[];
  canvas: BusinessModelCanvasMapping | null;
  processes: ProposedProcess[];
  indicators: ProposedIndicator[];
  risks: ProposedRisk[];
  actions: (ActionPlanMapping & { included: boolean })[];
  /** true quando a IA falhou e a proposta veio só do template */
  aiUnavailable: boolean;
}

export interface OnboardingStatus {
  completed: boolean;
  completedAt: string | null;
}

export async function getOnboardingStatus(companyId: string): Promise<OnboardingStatus> {
  const { data, error } = await supabase
    .from('companies')
    .select('onboarding_completed_at')
    .eq('id', companyId)
    .maybeSingle();
  if (error) {
    console.error("Error reading onboarding status:", error);
    throw new Error(error.message);
  }
  return { completed: !!data?.onboarding_completed_at, completedAt: data?.onboarding_completed_at ?? null };
}

export async function completeOnboarding(companyId: string): Promise<void> {
  const { error } = await supabase
    .from('companies')
    .update({ onboarding_completed_at: new Date().toISOString() })
    .eq('id', companyId);
  if (error) {
    console.error("Error completing onboarding:", error);
    throw new Error(error.message);
  }
}

const normalize = (s: string) => s.trim().toLowerCase();

/**
 * Grava os dados da empresa, chama a Análise Inteligente e monta a proposta
 * combinando o template do segmento (processos, indicadores, riscos) com o
 * que a IA gerou (identidade, pilares, SWOT, objetivos, canvas, plano de 90 dias).
 */
export async function generateProposal(companyId: string, input: OnboardingCompanyInput): Promise<OnboardingProposal> {
  const { data: current, error: readError } = await supabase.from('companies').select('*').eq('id', companyId).single();
  if (readError || !current) throw new Error(readError?.message || 'Empresa não encontrada');

  const settings = (current.settings && typeof current.settings === 'object' ? current.settings : {}) as Record<string, Json>;
  const aiContext = (settings.ai_context && typeof settings.ai_context === 'object' ? settings.ai_context : {}) as Record<string, Json>;

  const companyUpdate = {
    name: input.name.trim() || current.name,
    company_sector: SEGMENT_SECTOR_LABEL[input.segment],
    company_subsector: input.subsegment.trim() || null,
    company_size: input.company_size,
    company_description: input.company_description,
    operational_problems: input.operational_problems,
    business_objectives: input.business_objectives,
    settings: {
      ...settings,
      ai_context: { ...aiContext, company_website: input.company_website, company_instagram: input.company_instagram, segment: input.segment },
    } as Json,
  };
  const { error: updateError } = await supabase.from('companies').update(companyUpdate).eq('id', companyId);
  if (updateError) throw new Error(updateError.message);

  const template = getSegmentTemplate(input.segment);
  const processByKey = new Map((template?.processes ?? []).map(p => [p.key, p]));

  // IA: identidade, pilares, SWOT, objetivos, canvas, KPIs, riscos e plano
  let ai: Record<string, unknown> = {};
  let aiUnavailable = false;
  try {
    const { data, error } = await supabase.functions.invoke('company-intelligent-analysis', {
      body: {
        companyData: {
          ...current,
          ...companyUpdate,
          company_website: input.company_website,
          company_instagram: input.company_instagram,
          company_sector: `${SEGMENT_SECTOR_LABEL[input.segment]}${input.subsegment ? ` (${input.subsegment})` : ''}`,
        },
        analysisType: 'onboarding',
      },
    });
    if (error || !data?.success) throw error ?? new Error(data?.error || 'Análise indisponível');
    ai = data.analysis ?? {};
  } catch (error) {
    console.error('Análise Inteligente indisponível no onboarding:', error);
    aiUnavailable = true;
  }

  const strategic = StrategicPlanningMapper.mapStrategicPlanning(ai);
  const aiKpis = IndicatorMapper.mapIndicators(ai);
  const aiRisks = RiskMapper.mapRisks(ai);
  const aiActions = ActionPlanMapper.mapActionPlan(ai);

  const processes: ProposedProcess[] = (template?.processes ?? []).map(p => ({ ...p, included: true }));

  const templateIndicators: ProposedIndicator[] = (template?.indicators ?? []).map(i => ({
    ...i,
    processName: processByKey.get(i.processKey)?.name ?? i.processKey,
    origin: 'template',
    included: true,
  }));
  const knownIndicators = new Set(templateIndicators.map(i => normalize(i.name)));
  const extraIndicators: ProposedIndicator[] = aiKpis
    .filter(k => k.name && !knownIndicators.has(normalize(k.name)))
    .map(k => ({
      name: k.name,
      description: k.description,
      processKey: null,
      processName: k.process || 'Geral',
      goal_type: k.goal_type,
      goal_value: k.goal_value,
      unit: k.unit,
      calculation_type: k.calculation_type,
      origin: 'ai',
      // KPIs extras da IA entram desmarcados para não inflar a lista
      included: false,
    }));

  const templateRisks: ProposedRisk[] = (template?.risks ?? []).map(r => ({
    ...r,
    processName: processByKey.get(r.processKey)?.name ?? r.processKey,
    origin: 'template',
    included: true,
  }));
  const knownRisks = new Set(templateRisks.map(r => normalize(r.title)));
  const extraRisks: ProposedRisk[] = aiRisks
    .filter(r => r.title && !knownRisks.has(normalize(r.title)))
    .map(r => ({
      title: r.title,
      description: r.description,
      category: r.category,
      processKey: null,
      processName: r.process || 'Geral',
      probability: r.probability,
      impact: r.impact,
      mitigation_plan: r.mitigation_plan,
      origin: 'ai',
      included: true,
    }));

  return {
    mission: strategic.mission,
    vision: strategic.vision,
    values: strategic.values,
    ultimate_goal: strategic.ultimate_goal,
    pillars: strategic.pillars.map(p => ({ ...p, included: true })),
    swot: strategic.swot_items.map(s => ({ ...s, included: true })),
    objectives: strategic.bsc_objectives.map(o => ({ ...o, included: true })),
    canvas: strategic.canvas,
    processes,
    indicators: [...templateIndicators, ...extraIndicators],
    risks: [...templateRisks, ...extraRisks],
    actions: aiActions.map(a => ({ ...a, included: true })),
    aiUnavailable,
  };
}

export interface ApplyResult {
  processes: number;
  indicators: number;
  risks: number;
  objectives: number;
  actions: number;
}

/** Grava tudo que está marcado na proposta e conclui o onboarding. */
export async function applyProposal(companyId: string, proposal: OnboardingProposal): Promise<ApplyResult> {
  const result: ApplyResult = { processes: 0, indicators: 0, risks: 0, objectives: 0, actions: 0 };

  // 1. Processos (base da espinha dorsal)
  const selectedProcesses = proposal.processes.filter(p => p.included);
  const processIds = await ensureProcesses(selectedProcesses.map((p, index) => ({
    name: p.name,
    description: p.description,
    objective: p.objective,
    process_type: p.type,
    sort_order: index,
    source: 'template',
  })));
  result.processes = selectedProcesses.length;
  const keyToId = new Map(selectedProcesses.map(p => [p.key, processIds.get(normalize(p.name)) ?? null]));
  const keyToName = new Map(selectedProcesses.map(p => [p.key, p.name]));

  // 2. Estratégia: identidade, pilares, SWOT, objetivos com KPI, canvas
  const strategicResult = await StrategicPlanningApplication.applyStrategicPlanningDetailed({
    mission: proposal.mission,
    vision: proposal.vision,
    values: proposal.values,
    ultimate_goal: proposal.ultimate_goal,
    pillars: proposal.pillars.filter(p => p.included),
    swot_items: proposal.swot.filter(s => s.included),
    bsc_objectives: proposal.objectives.filter(o => o.included),
    canvas: proposal.canvas,
  }, companyId, { overwrite: true });
  result.objectives = strategicResult.objectivesCreated;

  // 3. Indicadores ligados ao processo
  const existingIndicators = new Set((await getAllIndicators()).map(i => normalize(i.name)));
  for (const indicator of proposal.indicators.filter(i => i.included)) {
    if (existingIndicators.has(normalize(indicator.name))) continue;
    await addIndicator({
      name: indicator.name,
      description: indicator.description,
      process: indicator.processKey ? keyToName.get(indicator.processKey) ?? indicator.processName : indicator.processName,
      process_id: indicator.processKey ? keyToId.get(indicator.processKey) ?? null : null,
      goal_type: indicator.goal_type,
      goal_value: indicator.goal_value,
      calculation_type: indicator.calculation_type,
      unit: indicator.unit,
    });
    existingIndicators.add(normalize(indicator.name));
    result.indicators++;
  }

  // 4. Riscos ligados ao processo
  const existingRisks = new Set((await getRisks()).map(r => normalize(r.title)));
  for (const risk of proposal.risks.filter(r => r.included)) {
    if (existingRisks.has(normalize(risk.title))) continue;
    await createRisk({
      title: risk.title,
      description: risk.description,
      category: risk.category,
      process: risk.processKey ? keyToName.get(risk.processKey) ?? risk.processName : risk.processName,
      process_id: risk.processKey ? keyToId.get(risk.processKey) ?? null : null,
      probability: risk.probability,
      impact: risk.impact,
      mitigation_plan: risk.mitigation_plan,
      responsible: 'A definir',
      status: 'active',
    });
    existingRisks.add(normalize(risk.title));
    result.risks++;
  }

  // 5. Plano de 90 dias
  const selectedActions = proposal.actions.filter(a => a.included);
  if (selectedActions.length > 0) {
    await ActionPlanApplication.applyActionPlan(selectedActions, companyId);
    result.actions = selectedActions.length;
  }

  await completeOnboarding(companyId);
  return result;
}
