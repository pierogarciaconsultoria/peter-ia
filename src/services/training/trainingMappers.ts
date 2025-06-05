
import { Training } from "@/types/training";

/**
 * Map HR training data from database to Training interface
 */
export function mapHrTrainingToTraining(hrTraining: any): Training {
  return {
    id: hrTraining.id,
    title: hrTraining.title,
    description: hrTraining.description || '',
    trainer: hrTraining.instructor || 'A definir',
    training_date: hrTraining.start_date,
    end_time: hrTraining.end_date,
    duration: hrTraining.duration || 2,
    department: hrTraining.department || 'Geral',
    participants: hrTraining.participants || [],
    status: hrTraining.status || 'planned',
    procedure_id: hrTraining.procedure_id,
    evaluation_method: hrTraining.evaluation_method || 'assessment',
    created_at: hrTraining.created_at,
    updated_at: hrTraining.updated_at,
    company_id: hrTraining.company_id
  };
}

/**
 * Map Training interface to HR training data for database
 */
export function mapTrainingToHrTraining(training: Partial<Training>): any {
  return {
    title: training.title,
    description: training.description,
    instructor: training.trainer,
    start_date: training.training_date,
    end_date: training.end_time,
    duration: training.duration,
    department: training.department,
    participants: training.participants,
    status: training.status,
    procedure_id: training.procedure_id,
    evaluation_method: training.evaluation_method,
    type: 'required',
    company_id: training.company_id
  };
}
