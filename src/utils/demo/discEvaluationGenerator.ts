
import { supabase } from "@/integrations/supabase/client";

/**
 * Generate DISC evaluations for the demo company
 * @param companyId The company ID to associate evaluations with
 * @param employeeIds Object with employee names as keys and their IDs as values
 */
export const generateDiscEvaluations = async (
  companyId: string,
  employeeIds: Record<string, string>
): Promise<boolean> => {
  const discEvaluations = [
    {
      employee_name: 'Tony Stark',
      primary_type: 'D',
      secondary_type: 'I',
      dominance_score: 90,
      influence_score: 85,
      steadiness_score: 40,
      compliance_score: 60,
      evaluation_date: '2023-02-10'
    },
    {
      employee_name: 'Bruce Banner',
      primary_type: 'C',
      secondary_type: 'S',
      dominance_score: 45,
      influence_score: 40,
      steadiness_score: 70,
      compliance_score: 90,
      evaluation_date: '2023-02-15'
    },
    {
      employee_name: 'Steve Rogers',
      primary_type: 'S',
      secondary_type: 'D',
      dominance_score: 70,
      influence_score: 60,
      steadiness_score: 85,
      compliance_score: 65,
      evaluation_date: '2023-03-01'
    }
  ];
  
  for (const disc of discEvaluations) {
    const employeeId = employeeIds[disc.employee_name];
    
    if (!employeeId) {
      console.error(`Could not find ID for ${disc.employee_name}`);
      continue;
    }
    
    try {
      const { error: discError } = await supabase
        .from('hr_disc_evaluations')
        .insert({
          employee_id: employeeId,
          primary_type: disc.primary_type,
          secondary_type: disc.secondary_type,
          dominance_score: disc.dominance_score,
          influence_score: disc.influence_score,
          steadiness_score: disc.steadiness_score,
          compliance_score: disc.compliance_score,
          evaluation_date: disc.evaluation_date,
          company_id: companyId
        });
        
      if (discError) {
        console.error(`Error creating DISC evaluation for ${disc.employee_name}:`, discError);
      }
    } catch (error) {
      console.error(`Error creating DISC evaluation for ${disc.employee_name}:`, error);
    }
  }
  
  return true;
};
