
import { supabase } from "@/integrations/supabase/client";
import { CreateTrainingInput, Training, TrainingFilters, UpdateTrainingInput } from "@/types/training";
import { mapHrTrainingToTraining, mapTrainingToHrTraining } from "./trainingMappers";

/**
 * Fetch all trainings with optional filters
 */
export async function getTrainings(filters?: TrainingFilters): Promise<Training[]> {
  try {
    let query = supabase
      .from('hr_trainings')
      .select('*');
    
    // Apply filters if provided
    if (filters) {
      if (filters.department) {
        query = query.eq('department', filters.department);
      }
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.startDate) {
        query = query.gte('start_date', filters.startDate);
      }
      
      if (filters.endDate) {
        query = query.lte('start_date', filters.endDate);
      }
      
      if (filters.searchQuery) {
        query = query.or(`title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
      }
      
      // Add pagination if specified
      if (filters.page !== undefined && filters.pageSize) {
        const from = filters.page * filters.pageSize;
        const to = from + filters.pageSize - 1;
        query = query.range(from, to);
      }
    }
    
    // Always order by start date descending
    query = query.order('start_date', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching trainings:", error);
      throw new Error(error.message);
    }
    
    // Process the data to ensure it matches our Training interface
    const trainings: Training[] = data.map(item => mapHrTrainingToTraining(item));
    
    return trainings;
  } catch (error) {
    console.error("Error in getTrainings:", error);
    throw error;
  }
}

/**
 * Get a training by ID
 */
export async function getTrainingById(id: string): Promise<Training> {
  try {
    const { data, error } = await supabase
      .from('hr_trainings')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching training:", error);
      throw new Error(error.message);
    }
    
    if (!data) {
      throw new Error(`Training with ID ${id} not found`);
    }
    
    // Convert the data to our Training interface
    const training: Training = mapHrTrainingToTraining(data);
    
    return training;
  } catch (error) {
    console.error("Error in getTrainingById:", error);
    throw error;
  }
}

/**
 * Create a new training
 */
export async function createTraining(trainingData: CreateTrainingInput): Promise<Training> {
  try {
    // Validate required fields
    if (!trainingData.title || !trainingData.training_date || !trainingData.trainer || !trainingData.department) {
      throw new Error("Missing required training data");
    }
    
    // Format the data for the database
    const dbData = mapTrainingToHrTraining(trainingData);
    
    const { data, error } = await supabase
      .from('hr_trainings')
      .insert([dbData])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating training:", error);
      throw new Error(error.message);
    }
    
    // Convert the returned data to our Training interface
    const newTraining: Training = mapHrTrainingToTraining(data);
    
    return newTraining;
  } catch (error) {
    console.error("Error in createTraining:", error);
    throw error;
  }
}

/**
 * Update an existing training
 */
export async function updateTraining(id: string, trainingData: UpdateTrainingInput): Promise<Training> {
  try {
    // Create update data object from our application model
    const updateData = mapTrainingToHrTraining(trainingData as any);
    
    // Always update the updated_at field
    updateData.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('hr_trainings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating training:", error);
      throw new Error(error.message);
    }
    
    // Convert the returned data to our Training interface
    const updatedTraining: Training = mapHrTrainingToTraining(data);
    
    return updatedTraining;
  } catch (error) {
    console.error("Error in updateTraining:", error);
    throw error;
  }
}

/**
 * Delete a training by ID
 */
export async function deleteTraining(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('hr_trainings')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting training:", error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error in deleteTraining:", error);
    throw error;
  }
}
