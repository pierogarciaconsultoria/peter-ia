
import { supabase } from "@/integrations/supabase/client";
import { Training, CreateTrainingInput, UpdateTrainingInput } from "@/types/training";
import { mapHrTrainingToTraining, mapTrainingToHrTraining } from "./trainingMappers";
import { fetchTrainings, fetchTraining } from "./trainingQueries";
import { generateTrainingCertificate } from "./trainingGeneration";

/**
 * Create a new training
 */
export const createTraining = async (trainingData: CreateTrainingInput): Promise<Training> => {
  const { data, error } = await supabase
    .from("hr_trainings")
    .insert(mapTrainingToHrTraining({
      ...trainingData,
      company_id: trainingData.company_id || 'default-company-id'
    }))
    .select()
    .single();

  if (error) throw error;
  
  return mapHrTrainingToTraining(data);
};

/**
 * Update an existing training
 */
export const updateTraining = async (
  id: string, 
  trainingData: Partial<Training> & { training_date?: string }
): Promise<Training> => {
  // Only update fields that are provided
  const updateData: any = {};
  
  if (trainingData.title) updateData.title = trainingData.title;
  if (trainingData.description !== undefined) updateData.description = trainingData.description;
  if (trainingData.trainer) updateData.instructor = trainingData.trainer;
  if (trainingData.training_date) updateData.start_date = trainingData.training_date;
  if (trainingData.end_time !== undefined) updateData.end_date = trainingData.end_time;
  if (trainingData.duration !== undefined) updateData.duration = trainingData.duration;
  if (trainingData.department) updateData.department = trainingData.department;
  if (trainingData.participants) updateData.participants = trainingData.participants;
  if (trainingData.status) updateData.status = trainingData.status;
  if (trainingData.procedure_id !== undefined) updateData.procedure_id = trainingData.procedure_id;
  if (trainingData.evaluation_method !== undefined) updateData.evaluation_method = trainingData.evaluation_method;

  const { data, error } = await supabase
    .from("hr_trainings")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  
  return mapHrTrainingToTraining(data);
};

/**
 * Delete a training
 */
export const deleteTraining = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("hr_trainings")
    .delete()
    .eq("id", id);
    
  if (error) throw error;
};

/**
 * Create a training in batch mode
 */
export const createTrainingBatch = async (trainingsData: CreateTrainingInput[]): Promise<number> => {
  const { data, error } = await supabase
    .from("hr_trainings")
    .insert(
      trainingsData.map(training => mapTrainingToHrTraining({
        ...training,
        company_id: training.company_id || 'default-company-id'
      }))
    );
    
  if (error) throw error;
  
  return trainingsData.length;
};

// Re-export functions from other modules for convenience
export {
  fetchTrainings,
  fetchTraining,
  generateTrainingCertificate
};
