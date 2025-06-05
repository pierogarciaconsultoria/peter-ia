
import { supabase } from "@/integrations/supabase/client";
import { Training, TrainingFilters } from "@/types/training";
import { mapHrTrainingToTraining } from "./trainingMappers";

/**
 * Fetch trainings with optional filters
 */
export const fetchTrainings = async (filters?: TrainingFilters): Promise<Training[]> => {
  try {
    let query = supabase
      .from('hr_trainings')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters if provided
    if (filters) {
      if (filters.department && filters.department !== 'all') {
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
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching trainings:', error);
      throw error;
    }

    return (data || []).map(mapHrTrainingToTraining);
  } catch (error) {
    console.error('Training query error:', error);
    throw error;
  }
};

/**
 * Fetch a single training by ID
 */
export const fetchTraining = async (id: string): Promise<Training | null> => {
  try {
    const { data, error } = await supabase
      .from('hr_trainings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching training:', error);
      throw error;
    }

    return data ? mapHrTrainingToTraining(data) : null;
  } catch (error) {
    console.error('Training query error:', error);
    throw error;
  }
};
