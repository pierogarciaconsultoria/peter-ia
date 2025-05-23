
import { supabase } from "@/integrations/supabase/client";
import { Training, TrainingFilters, CreateTrainingInput, UpdateTrainingInput } from "@/types/training";
import { toast } from "sonner";
import { mapHrTrainingToTraining, mapTrainingToHrTraining } from "./trainingMappers";

/**
 * Get all trainings with optional filters
 */
export async function getTrainings(filters?: TrainingFilters): Promise<Training[]> {
  try {
    let query = supabase
      .from('hr_trainings')
      .select('*');
    
    // Apply filters
    if (filters?.department) {
      query = query.eq('department', filters.department);
    }
    
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters?.startDate) {
      query = query.gte('start_date', filters.startDate);
    }
    
    if (filters?.endDate) {
      query = query.lte('end_date', filters.endDate);
    }
    
    if (filters?.searchQuery) {
      query = query.ilike('title', `%${filters.searchQuery}%`);
    }
    
    // Pagination
    if (filters?.page !== undefined && filters?.pageSize) {
      const start = filters.page * filters.pageSize;
      const end = start + filters.pageSize - 1;
      query = query.range(start, end);
    }
    
    // Order by date
    query = query.order('start_date', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching trainings:", error);
      throw error;
    }
    
    // Map to our Training interface
    return data.map(item => mapHrTrainingToTraining(item));
  } catch (error) {
    console.error("Error in getTrainings:", error);
    toast.error("Erro ao carregar treinamentos", {
      description: "Não foi possível buscar os treinamentos"
    });
    return [];
  }
}

/**
 * Get a specific training by ID
 */
export async function getTrainingById(id: string): Promise<Training | null> {
  try {
    const { data, error } = await supabase
      .from('hr_trainings')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching training:", error);
      throw error;
    }
    
    if (!data) return null;
    
    return mapHrTrainingToTraining(data);
  } catch (error) {
    console.error("Error in getTrainingById:", error);
    toast.error("Erro ao carregar treinamento", {
      description: "Não foi possível buscar o treinamento específico"
    });
    return null;
  }
}

/**
 * Create a new training
 */
export async function createTraining(trainingData: CreateTrainingInput): Promise<Training> {
  try {
    if (!trainingData.company_id) {
      trainingData.company_id = 'default-company-id'; // Ensure company_id is provided
    }

    const { data, error } = await supabase
      .from('hr_trainings')
      .insert(mapTrainingToHrTraining(trainingData))
      .select()
      .single();
    
    if (error) {
      console.error("Error creating training:", error);
      throw error;
    }
    
    return mapHrTrainingToTraining(data);
  } catch (error) {
    console.error("Error in createTraining:", error);
    toast.error("Erro ao criar treinamento", {
      description: "Não foi possível criar o novo treinamento"
    });
    throw error;
  }
}

/**
 * Update an existing training
 */
export async function updateTraining(id: string, trainingData: UpdateTrainingInput): Promise<Training> {
  try {
    const { data, error } = await supabase
      .from('hr_trainings')
      .update(mapTrainingToHrTraining({ ...trainingData, title: trainingData.title || 'Untitled', training_date: trainingData.training_date || new Date().toISOString() }))
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating training:", error);
      throw error;
    }
    
    return mapHrTrainingToTraining(data);
  } catch (error) {
    console.error("Error in updateTraining:", error);
    toast.error("Erro ao atualizar treinamento", {
      description: "Não foi possível atualizar o treinamento"
    });
    throw error;
  }
}

/**
 * Delete a training by ID
 */
export async function deleteTraining(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('hr_trainings')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting training:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteTraining:", error);
    toast.error("Erro ao excluir treinamento", {
      description: "Não foi possível excluir o treinamento"
    });
    return false;
  }
}
