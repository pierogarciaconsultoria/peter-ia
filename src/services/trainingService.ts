
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

export async function generateTrainingsForEmployee(
  employeeId: string, 
  jobPositionId: string, 
  employeeName: string,
  departmentName: string
): Promise<Training[]> {
  try {
    console.log('Training service - mock training generation until database setup');
    
    // Mock training generation based on job position
    const mockTrainings: Training[] = [
      {
        id: crypto.randomUUID(),
        title: `Treinamento de Integração - ${employeeName}`,
        description: `Treinamento básico de integração para o cargo`,
        trainer: "A definir",
        department: departmentName,
        training_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        duration: 8,
        status: 'planned' as const,
        participants: [
          {
            id: employeeId,
            name: employeeName
          }
        ],
        evaluation_method: "Avaliação prática",
        company_id: 'default-company-id',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        title: `Treinamento de Segurança do Trabalho`,
        description: `Treinamento obrigatório de segurança e saúde ocupacional`,
        trainer: "A definir",
        department: departmentName,
        training_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        duration: 4,
        status: 'planned' as const,
        participants: [
          {
            id: employeeId,
            name: employeeName
          }
        ],
        evaluation_method: "Teste teórico",
        company_id: 'default-company-id',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    return mockTrainings;
  } catch (error) {
    console.error("Error generating trainings for employee:", error);
    throw error;
  }
}
