
import { supabase } from '@/integrations/supabase/client';

export interface Training {
  id: string;
  title: string;
  description?: string;
  trainer: string;
  department: string;
  training_date: string;
  duration: number;
  status: 'planned' | 'in_progress' | 'completed' | 'canceled';
  participants?: Array<{
    id: string;
    name: string;
  }>;
  evaluation_method?: string;
  procedure_id?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface TrainingFilters {
  searchQuery?: string;
  department?: string;
  employeeId?: string;
  procedure?: string;
  startDate?: string;
  endDate?: string;
}

export async function fetchTrainings(filters?: TrainingFilters): Promise<Training[]> {
  try {
    // Para agora, retorna dados mock até a tabela ser criada
    console.log('Training service - returning mock data until database setup');
    return [];
  } catch (error) {
    console.error('Error fetching trainings:', error);
    throw error;
  }
}

export async function createTraining(training: Partial<Training>): Promise<Training> {
  try {
    // Para agora, retorna dados mock até a tabela ser criada
    console.log('Training service - mock creation until database setup');
    return {
      id: crypto.randomUUID(),
      title: training.title || '',
      trainer: training.trainer || '',
      department: training.department || '',
      training_date: training.training_date || new Date().toISOString(),
      duration: training.duration || 0,
      status: training.status || 'planned',
      company_id: training.company_id || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating training:', error);
    throw error;
  }
}
