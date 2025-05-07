
import { supabase } from "@/integrations/supabase/client";

/**
 * Generate performance evaluations for the demo company
 * @param companyId The company ID to associate evaluations with
 * @param employeeIds Object with employee names as keys and their IDs as values
 */
export const generatePerformanceEvaluations = async (
  companyId: string,
  employeeIds: Record<string, string>
): Promise<boolean> => {
  const evaluations = [
    {
      employee_name: 'Peter Parker',
      evaluator_name: 'Tony Stark',
      evaluation_date: '2023-04-15',
      evaluation_period: '2022-Q4',
      evaluation_type: 'annual',
      status: 'completed',
      skills_score: 85,
      goals_achievement_score: 90,
      overall_score: 88,
      comments: 'Excelente desempenho técnico, superou expectativas em desenvolvimento.',
      strengths: 'Capacidade técnica, trabalho em equipe, criatividade',
      improvement_areas: 'Comunicação com outras equipes, documentação'
    },
    {
      employee_name: 'Natasha Romanoff',
      evaluator_name: 'Tony Stark',
      evaluation_date: '2023-03-10',
      evaluation_period: '2022-Q4',
      evaluation_type: 'annual',
      status: 'completed',
      skills_score: 95,
      goals_achievement_score: 92,
      overall_score: 94,
      comments: 'Desempenho excepcional na gestão da equipe de produção.',
      strengths: 'Liderança, organização, resolução de problemas',
      improvement_areas: 'Delegação de tarefas'
    }
  ];
  
  for (const evaluation of evaluations) {
    const employeeId = employeeIds[evaluation.employee_name];
    const evaluatorId = employeeIds[evaluation.evaluator_name];
    
    if (!employeeId || !evaluatorId) {
      console.error(`Could not find IDs for ${evaluation.employee_name} or ${evaluation.evaluator_name}`);
      continue;
    }
    
    try {
      const { error: evalError } = await supabase
        .from('performance_evaluations')
        .insert({
          employee_id: employeeId,
          evaluator_id: evaluatorId,
          company_id: companyId,
          evaluation_date: evaluation.evaluation_date,
          evaluation_period: evaluation.evaluation_period,
          evaluation_type: evaluation.evaluation_type,
          status: evaluation.status,
          skills_score: evaluation.skills_score,
          goals_achievement_score: evaluation.goals_achievement_score,
          overall_score: evaluation.overall_score,
          comments: evaluation.comments,
          strengths: evaluation.strengths,
          improvement_areas: evaluation.improvement_areas
        });
        
      if (evalError) {
        console.error(`Error creating evaluation for ${evaluation.employee_name}:`, evalError);
      }
    } catch (error) {
      console.error(`Error creating evaluation for ${evaluation.employee_name}:`, error);
    }
  }
  
  return true;
};
