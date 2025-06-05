
import { supabase } from '@/integrations/supabase/client';
import { Training, TrainingFilters } from '@/types/training';

export const fetchTrainings = async (filters?: TrainingFilters): Promise<Training[]> => {
  try {
    let query = supabase
      .from('trainings')
      .select(`
        *,
        employee_trainings (
          id,
          employee_id,
          status,
          completion_date,
          score,
          employees (
            id,
            name
          )
        )
      `)
      .order('created_at', { ascending: false });

    // Apply filters if provided
    if (filters) {
      if (filters.department && filters.department !== 'all') {
        // This would need a join with employees or a different approach
        // For now, we'll fetch all and filter in memory
      }
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate);
      }
      
      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching trainings:', error);
      throw error;
    }

    // Transform the data to match the Training interface
    const trainings: Training[] = (data || []).map(training => ({
      id: training.id,
      title: training.name,
      description: training.description,
      trainer: training.instructor || 'N/A',
      training_date: training.created_at,
      duration: training.duration_hours || 0,
      department: 'Geral', // Default department
      participants: training.employee_trainings?.map((et: any) => ({
        id: et.employee_id,
        name: et.employees?.name || 'Unknown',
        status: et.status,
        attended: et.status === 'completed'
      })) || [],
      status: training.status === 'active' ? 'planned' : 'canceled',
      procedure_id: null,
      evaluation_method: 'assessment',
      created_at: training.created_at,
      updated_at: training.updated_at,
      company_id: training.company_id
    }));

    return trainings;
  } catch (error) {
    console.error('Training service error:', error);
    throw error;
  }
};

export const createTraining = async (training: Omit<Training, 'id' | 'created_at' | 'updated_at'>): Promise<Training> => {
  try {
    const trainingData = {
      name: training.title,
      description: training.description,
      instructor: training.trainer,
      duration_hours: training.duration,
      type: 'internal',
      status: 'active',
      company_id: training.company_id
    };

    const { data, error } = await supabase
      .from('trainings')
      .insert([trainingData])
      .select()
      .single();

    if (error) {
      console.error('Error creating training:', error);
      throw error;
    }

    // Transform back to Training interface
    const newTraining: Training = {
      id: data.id,
      title: data.name,
      description: data.description,
      trainer: data.instructor || 'N/A',
      training_date: data.created_at,
      duration: data.duration_hours || 0,
      department: training.department,
      participants: [],
      status: 'planned',
      procedure_id: training.procedure_id,
      evaluation_method: training.evaluation_method,
      created_at: data.created_at,
      updated_at: data.updated_at,
      company_id: data.company_id
    };

    return newTraining;
  } catch (error) {
    console.error('Training creation error:', error);
    throw error;
  }
};
