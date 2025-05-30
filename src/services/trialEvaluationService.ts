
import { supabase } from "@/integrations/supabase/client";

export interface TrialEvaluationConfig {
  id: string;
  company_id: string;
  evaluation_periods: number[];
  evaluation_criteria: EvaluationCriterion[];
  scale_min: number;
  scale_max: number;
  created_at: string;
  updated_at: string;
}

export interface EvaluationCriterion {
  name: string;
  description: string;
}

export interface TrialEvaluation {
  id: string;
  employee_id: string;
  evaluation_date: string;
  evaluator_id: string | null;
  performance_score: number | null;
  adaptation_score: number | null;
  behavior_score: number | null;
  approved: boolean | null;
  company_id: string;
  created_at: string;
  updated_at: string;
  evaluation_type: '30_dias' | '45_dias' | '60_dias' | '90_dias';
  comments: string | null;
  hr_approved: boolean | null;
  hr_approved_at: string | null;
  hr_approver_id: string | null;
  notification_sent: boolean;
  // Novos campos brasileiros
  sector: string | null;
  immediate_supervisor_name: string | null;
  immediate_supervisor_id: string | null;
  evaluation_criteria_scores: Record<string, number>;
  final_decision: 'approved' | 'rejected' | 'extended' | null;
  decision_justification: string | null;
  employee_signature_date: string | null;
  supervisor_signature_date: string | null;
  hr_signature_date: string | null;
  evaluation_period_number: number;
  total_evaluation_periods: number;
}

export interface EmployeeDetails {
  name: string;
  position: string;
  department: string;
  avatar_url: string | null;
  hire_date: string;
  job_position_id: string | null;
  sector: string | null;
  immediate_supervisor_id: string | null;
  salary: number | null;
}

export interface TrialEvaluationWithEmployee extends TrialEvaluation {
  employee: EmployeeDetails;
  evaluator?: { name: string | null };
  immediate_supervisor?: { name: string | null };
}

// Buscar configuração da empresa
export async function getTrialEvaluationConfig(companyId: string): Promise<TrialEvaluationConfig | null> {
  const { data, error } = await supabase
    .from('trial_evaluation_configs')
    .select('*')
    .eq('company_id', companyId)
    .single();

  if (error) {
    console.error("Error fetching trial evaluation config:", error);
    return null;
  }

  return {
    ...data,
    evaluation_periods: Array.isArray(data.evaluation_periods) ? data.evaluation_periods : JSON.parse(data.evaluation_periods as string),
    evaluation_criteria: Array.isArray(data.evaluation_criteria) ? data.evaluation_criteria : JSON.parse(data.evaluation_criteria as string)
  };
}

// Criar ou atualizar configuração da empresa
export async function upsertTrialEvaluationConfig(config: Partial<TrialEvaluationConfig>): Promise<boolean> {
  const { error } = await supabase
    .from('trial_evaluation_configs')
    .upsert({
      company_id: config.company_id!,
      evaluation_periods: config.evaluation_periods,
      evaluation_criteria: config.evaluation_criteria,
      scale_min: config.scale_min,
      scale_max: config.scale_max
    });

  if (error) {
    console.error("Error upserting trial evaluation config:", error);
    return false;
  }

  return true;
}

// Buscar todas as avaliações com detalhes do funcionário
export async function getTrialEvaluations(): Promise<TrialEvaluationWithEmployee[]> {
  const { data, error } = await supabase
    .from('trial_period_evaluations')
    .select(`
      *,
      employee:employee_id(
        name, 
        position, 
        department, 
        avatar_url, 
        hire_date, 
        job_position_id,
        sector,
        immediate_supervisor_id,
        salary
      ),
      evaluator:evaluator_id(name),
      immediate_supervisor:immediate_supervisor_id(name)
    `)
    .order('evaluation_date', { ascending: false });

  if (error) {
    console.error("Error fetching trial evaluations:", error);
    throw new Error(error.message);
  }

  return (data || []).map(item => ({
    ...item,
    employee: item.employee || {
      name: 'Unknown',
      position: 'Unknown',
      department: 'Unknown',
      avatar_url: null,
      hire_date: 'Unknown',
      job_position_id: null,
      sector: null,
      immediate_supervisor_id: null,
      salary: null
    },
    evaluator: item.evaluator || { name: null },
    immediate_supervisor: item.immediate_supervisor || { name: null }
  })) as TrialEvaluationWithEmployee[];
}

// Criar avaliação de experiência
export async function createTrialEvaluation(evaluation: Partial<TrialEvaluation>): Promise<boolean> {
  const { error } = await supabase
    .from('trial_period_evaluations')
    .insert(evaluation);

  if (error) {
    console.error("Error creating trial evaluation:", error);
    return false;
  }

  return true;
}

// Atualizar avaliação de experiência
export async function updateTrialEvaluation(
  id: string, 
  evaluation: Partial<TrialEvaluation>
): Promise<boolean> {
  const { error } = await supabase
    .from('trial_period_evaluations')
    .update({
      ...evaluation,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error("Error updating trial evaluation:", error);
    return false;
  }

  return true;
}

// Gerar avaliações automaticamente usando a nova função
export async function generateTrialEvaluationsBR(employee_id: string, hire_date: string): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('generate_trial_evaluations_br', {
      employee_id,
      hire_date
    });

    if (error) {
      console.error("Error generating trial evaluations:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error calling generate_trial_evaluations_br:", error);
    return false;
  }
}

// Buscar avaliações por funcionário para comparação
export async function getEmployeeTrialEvaluations(employeeId: string): Promise<TrialEvaluationWithEmployee[]> {
  const { data, error } = await supabase
    .from('trial_period_evaluations')
    .select(`
      *,
      employee:employee_id(
        name, 
        position, 
        department, 
        avatar_url, 
        hire_date, 
        job_position_id,
        sector,
        immediate_supervisor_id,
        salary
      ),
      evaluator:evaluator_id(name),
      immediate_supervisor:immediate_supervisor_id(name)
    `)
    .eq('employee_id', employeeId)
    .order('evaluation_period_number', { ascending: true });

  if (error) {
    console.error("Error fetching employee trial evaluations:", error);
    throw new Error(error.message);
  }

  return (data || []).map(item => ({
    ...item,
    employee: item.employee || {
      name: 'Unknown',
      position: 'Unknown',
      department: 'Unknown',
      avatar_url: null,
      hire_date: 'Unknown',
      job_position_id: null,
      sector: null,
      immediate_supervisor_id: null,
      salary: null
    },
    evaluator: item.evaluator || { name: null },
    immediate_supervisor: item.immediate_supervisor || { name: null }
  })) as TrialEvaluationWithEmployee[];
}
