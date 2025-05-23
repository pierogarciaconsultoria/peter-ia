
import { supabase } from "@/integrations/supabase/client";
import { Training, TrainingFilters } from "@/types/training";
import { mapHrTrainingToTraining } from "./trainingMappers";

/**
 * Fetch trainings with optional filters
 */
export async function fetchTrainings(filters?: TrainingFilters): Promise<Training[]> {
  try {
    let query = supabase
      .from('hr_trainings')
      .select('*')
      .order('start_date', { ascending: false });
    
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
        query = query.ilike('title', `%${filters.searchQuery}%`);
      }
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching trainings:", error);
      throw error;
    }
    
    // Convert the data to our Training interface
    const trainings: Training[] = data.map(item => mapHrTrainingToTraining(item));
    
    return trainings;
  } catch (error) {
    console.error("Error in fetchTrainings:", error);
    throw error;
  }
}

/**
 * Fetch a single training by id
 */
export async function fetchTraining(id: string): Promise<Training | null> {
  try {
    const { data, error } = await supabase
      .from('hr_trainings')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching training by id:", error);
      throw error;
    }
    
    if (!data) return null;
    
    // Convert the data to our Training interface
    return mapHrTrainingToTraining(data);
  } catch (error) {
    console.error("Error in fetchTraining:", error);
    throw error;
  }
}
