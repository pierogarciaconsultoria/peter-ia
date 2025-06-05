
import { supabase } from '@/integrations/supabase/client';

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
const getTrainingMatrix = async (companyId: string): Promise<TrainingMatrix[]> => {
  try {
    console.log('Getting training matrix - using mock data until training_requirements table exists');
    
    // Mock training matrix data since training_requirements table doesn't exist
    const mockMatrix: TrainingMatrix[] = [
      {
        id: '1',
        employee_id: '1',
        training_id: '1',
        required: true,
        completed: false,
        due_date: '2024-12-31',
        status: 'pending'
      },
      {
        id: '2',
        employee_id: '2',
        training_id: '1',
        required: true,
        completed: true,
        completion_date: '2024-01-15',
        status: 'completed'
      }
    ];

    return mockMatrix;
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

const getEmployeeCompliance = async (companyId: string) => {
  try {
    console.log('Getting employee compliance - mock implementation');
    return [];
  } catch (error) {
    console.error('Error fetching employee compliance:', error);
    return [];
  }
};

const getComplianceStats = async (companyId: string) => {
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

const getJobPositionRequirements = async (companyId: string) => {
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
