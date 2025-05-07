
import { supabase } from "@/integrations/supabase/client";
import { demoTrainingData } from "./demoData";

/**
 * Generate training records for the demo company
 * @param companyId The company ID to associate trainings with
 */
export const generateTrainings = async (companyId: string): Promise<boolean> => {
  for (const training of demoTrainingData) {
    try {
      const { error: trainError } = await supabase
        .from('hr_trainings')
        .insert({
          ...training,
          company_id: companyId
        });
        
      if (trainError) {
        console.error(`Error creating training ${training.title}:`, trainError);
      }
    } catch (error) {
      console.error(`Error creating training ${training.title}:`, error);
    }
  }
  
  return true;
};
