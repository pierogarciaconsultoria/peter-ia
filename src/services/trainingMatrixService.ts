
import { supabase } from '@/integrations/supabase/client';
import { TrainingMatrixData, JobPositionTrainingRequirement } from '@/types/trainingMatrix';

export class TrainingMatrixService {
  static async getTrainingMatrix(companyId: string): Promise<TrainingMatrixData[]> {
    try {
      // This is a simplified version - in a real implementation you'd join multiple tables
      const { data, error } = await supabase
        .from('training_requirements')
        .select('*')
        .eq('company_id', companyId);

      if (error) {
        console.error('Error fetching training matrix:', error);
        throw error;
      }

      // Transform to expected format
      return (data || []).map(req => ({
        jobPosition: {
          id: req.id,
          title: req.name,
          department: 'General'
        },
        requirements: [],
        compliance: []
      }));
    } catch (error) {
      console.error('Training matrix service error:', error);
      throw error;
    }
  }

  static async getJobPositionRequirements(companyId: string): Promise<JobPositionTrainingRequirement[]> {
    try {
      const { data, error } = await supabase
        .from('training_requirements')
        .select('*')
        .eq('company_id', companyId);

      if (error) {
        console.error('Error fetching job position requirements:', error);
        throw error;
      }

      // Transform to expected format
      return (data || []).map(req => ({
        id: req.id,
        job_position_id: req.id,
        training_id: req.id,
        procedure_id: null,
        is_mandatory: req.mandatory,
        completion_deadline_days: req.frequency_months ? req.frequency_months * 30 : 90,
        created_at: req.created_at,
        updated_at: req.updated_at,
        company_id: req.company_id,
        created_by: null,
        job_position: {
          id: req.id,
          title: req.name,
          department_id: req.id,
          department: {
            name: 'General'
          }
        },
        training: {
          id: req.id,
          title: req.name,
          description: req.description
        },
        procedure: null
      }));
    } catch (error) {
      console.error('Job position requirements service error:', error);
      throw error;
    }
  }

  static async deleteJobPositionRequirement(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('training_requirements')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting job position requirement:', error);
        throw error;
      }
    } catch (error) {
      console.error('Delete job position requirement error:', error);
      throw error;
    }
  }
}
