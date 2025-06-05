
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
      title: training.title || 'Untitled Training',
      description: training.description,
      trainer: training.trainer || 'N/A',
      training_date: training.training_date || training.created_at,
      duration: training.duration || 0,
      department: training.department || 'Geral',
      participants: Array.isArray(training.employee_trainings) ? training.employee_trainings.map((et: any) => ({
        id: et.employee_id,
        name: et.employees?.name || 'Unknown',
        status: et.status,
        attended: et.status === 'completed'
      })) : [],
      status: training.status === 'active' ? 'planned' : 'canceled',
      procedure_id: null,
      evaluation_method: training.evaluation_method || 'assessment',
      created_at: training.created_at,
      updated_at: training.updated_at,
      company_id: training.empresa_id || training.company_id || ''
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
      title: training.title,
      description: training.description,
      trainer: training.trainer,
      duration: training.duration,
      department: training.department || 'Geral',
      training_date: training.training_date,
      status: 'active',
      empresa_id: training.company_id,
      evaluation_method: training.evaluation_method
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
      title: data.title,
      description: data.description,
      trainer: data.trainer || 'N/A',
      training_date: data.training_date,
      duration: data.duration || 0,
      department: data.department,
      participants: [],
      status: 'planned',
      procedure_id: training.procedure_id,
      evaluation_method: data.evaluation_method,
      created_at: data.created_at,
      updated_at: data.updated_at,
      company_id: data.empresa_id || ''
    };

    return newTraining;
  } catch (error) {
    console.error('Training creation error:', error);
    throw error;
  }
};
