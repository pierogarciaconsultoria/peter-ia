
import { Training } from "@/types/training";
import { getTrainings } from "./trainingService";
import { supabase } from "@/integrations/supabase/client";
import { mapHrTrainingToTraining } from "./trainingMappers";

/**
 * Get trainings by department
 */
export async function getTrainingsByDepartment(department: string): Promise<Training[]> {
  return getTrainings({ department });
}

/**
 * Get trainings by status
 */
export async function getTrainingsByStatus(status: Training['status']): Promise<Training[]> {
  return getTrainings({ status });
}

/**
 * Get trainings for a specific employee
 */
export async function getTrainingsForEmployee(employeeId: string): Promise<Training[]> {
  try {
    const { data, error } = await supabase
      .from('hr_trainings')
      .select('*')
      .contains('participants', [{ id: employeeId }])
      .order('start_date', { ascending: false });
    
    if (error) {
      console.error("Error fetching employee trainings:", error);
      throw new Error(error.message);
    }
    
    // Convert the data to our Training interface
    const trainings: Training[] = data.map(item => mapHrTrainingToTraining(item));
    
    return trainings;
  } catch (error) {
    console.error("Error in getTrainingsForEmployee:", error);
    throw error;
  }
}
