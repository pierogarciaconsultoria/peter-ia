
import { supabase } from '@/integrations/supabase/client';
import { TrainingMatrixData, JobPositionTrainingRequirement, EmployeeTrainingCompliance, ComplianceStats } from '@/types/trainingMatrix';

export interface TrainingMatrix {
  id: string;
  employee_id: string;
  training_id: string;
  required: boolean;
  completed: boolean;
  completion_date?: string;
  due_date?: string;
  status: 'pending' | 'completed' | 'overdue';
}

// Implementação das funções do serviço
const getTrainingMatrix = async (companyId: string): Promise<TrainingMatrixData[]> => {
  try {
    console.log('Getting training matrix - using mock data until training_requirements table exists');
    
    // Mock training matrix data transformed to TrainingMatrixData format
    const mockMatrixData: TrainingMatrixData[] = [
      {
        jobPosition: {
          id: '1',
          title: 'Inspetor de Qualidade',
          department: 'Qualidade'
        },
        requirements: [
          {
            id: '1',
            job_position_id: '1',
            training_id: '1',
            is_mandatory: true,
            completion_deadline_days: 30,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            company_id: companyId,
            training: {
              id: '1',
              title: 'Treinamento em Controle de Qualidade',
              description: 'Treinamento básico em procedimentos de qualidade'
            }
          }
        ],
        compliance: [
          {
            id: '1',
            employee_id: '1',
            requirement_id: '1',
            status: 'pending',
            assigned_date: new Date().toISOString(),
            due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            company_id: companyId,
            employee: {
              id: '1',
              name: 'João Silva',
              position: 'Inspetor de Qualidade',
              department: 'Qualidade'
            }
          }
        ]
      }
    ];

    return mockMatrixData;
  } catch (error) {
    console.error('Error fetching training matrix:', error);
    return [];
  }
};

const updateTrainingCompletion = async (
  employeeId: string,
  trainingId: string,
  completed: boolean,
  completionDate?: string
): Promise<boolean> => {
  try {
    console.log('Updating training completion - mock implementation');
    return true;
  } catch (error) {
    console.error('Error updating training completion:', error);
    return false;
  }
};

const generateComplianceReport = async (companyId: string) => {
  try {
    console.log('Generating compliance report - mock implementation');
    
    return {
      totalEmployees: 10,
      compliantEmployees: 8,
      overdueTrainings: 2,
      upcomingDeadlines: 3,
      complianceRate: 80
    };
  } catch (error) {
    console.error('Error generating compliance report:', error);
    return null;
  }
};

const getEmployeeCompliance = async (companyId: string): Promise<EmployeeTrainingCompliance[]> => {
  try {
    console.log('Getting employee compliance - mock implementation');
    return [];
  } catch (error) {
    console.error('Error fetching employee compliance:', error);
    return [];
  }
};

const getComplianceStats = async (companyId: string): Promise<ComplianceStats> => {
  try {
    console.log('Getting compliance stats - mock implementation');
    return {
      total: 0,
      completed: 0,
      pending: 0,
      inProgress: 0,
      overdue: 0,
      completionRate: 0
    };
  } catch (error) {
    console.error('Error fetching compliance stats:', error);
    return {
      total: 0,
      completed: 0,
      pending: 0,
      inProgress: 0,
      overdue: 0,
      completionRate: 0
    };
  }
};

const updateEmployeeCompliance = async (id: string, updates: any) => {
  try {
    console.log('Updating employee compliance - mock implementation');
    return true;
  } catch (error) {
    console.error('Error updating employee compliance:', error);
    return false;
  }
};

const getJobPositionRequirements = async (companyId: string): Promise<JobPositionTrainingRequirement[]> => {
  try {
    console.log('Getting job position requirements - mock implementation');
    return [];
  } catch (error) {
    console.error('Error fetching job position requirements:', error);
    return [];
  }
};

const createJobPositionRequirement = async (data: any) => {
  try {
    console.log('Creating job position requirement - mock implementation');
    return { id: 'mock-id' };
  } catch (error) {
    console.error('Error creating job position requirement:', error);
    throw error;
  }
};

const updateJobPositionRequirement = async (id: string, data: any) => {
  try {
    console.log('Updating job position requirement - mock implementation');
    return { id };
  } catch (error) {
    console.error('Error updating job position requirement:', error);
    throw error;
  }
};

const deleteJobPositionRequirement = async (id: string) => {
  try {
    console.log('Deleting job position requirement - mock implementation');
    return true;
  } catch (error) {
    console.error('Error deleting job position requirement:', error);
    throw error;
  }
};

// Exportar como objeto de serviço
export const TrainingMatrixService = {
  getTrainingMatrix,
  updateTrainingCompletion,
  generateComplianceReport,
  getEmployeeCompliance,
  getComplianceStats,
  updateEmployeeCompliance,
  getJobPositionRequirements,
  createJobPositionRequirement,
  updateJobPositionRequirement,
  deleteJobPositionRequirement
};

// Exportações individuais para compatibilidade
export {
  getTrainingMatrix,
  updateTrainingCompletion,
  generateComplianceReport
};
