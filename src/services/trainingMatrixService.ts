
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

export const getTrainingMatrix = async (companyId: string): Promise<TrainingMatrix[]> => {
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

export const updateTrainingCompletion = async (
  employeeId: string,
  trainingId: string,
  completed: boolean,
  completionDate?: string
): Promise<boolean> => {
  try {
    console.log('Updating training completion - mock implementation');
    // Mock implementation until proper table exists
    return true;
  } catch (error) {
    console.error('Error updating training completion:', error);
    return false;
  }
};

export const generateComplianceReport = async (companyId: string) => {
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
