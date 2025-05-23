
import { Training, TrainingParticipant } from "@/types/training";
import { Database } from "@/integrations/supabase/types";

type HrTrainingRow = Database['public']['Tables']['hr_trainings']['Row'];
type HrTrainingInsert = Database['public']['Tables']['hr_trainings']['Insert'];

/**
 * Converts a Supabase HR training row to our application Training interface
 */
export function mapHrTrainingToTraining(item: HrTrainingRow): Training {
  return {
    id: item.id,
    title: item.title,
    description: item.description || undefined,
    trainer: item.instructor || 'A definir',
    training_date: item.start_date,
    start_time: item.start_date,
    end_time: item.end_date || undefined,
    duration: item.duration || 0,
    department: item.department || '',
    participants: item.participants ? processParticipants(item.participants as any) : undefined,
    status: (item.status as Training['status']) || 'planned',
    procedure_id: item.procedure_id as string | undefined,
    evaluation_method: item.evaluation_method as string | undefined,
    created_at: item.created_at,
    updated_at: item.updated_at
  };
}

/**
 * Converts our application Training interface to a Supabase HR training insert/update object
 */
export function mapTrainingToHrTraining(
  training: Partial<Training> & { title: string; training_date: string }
): HrTrainingInsert {
  return {
    title: training.title,
    description: training.description,
    instructor: training.trainer,
    start_date: training.training_date,
    end_date: training.end_time,
    duration: training.duration,
    department: training.department,
    participants: training.participants as any,
    status: training.status,
    procedure_id: training.procedure_id as string | undefined,
    evaluation_method: training.evaluation_method,
    type: 'standard', // Default value for required field
    company_id: training.company_id || 'default-company-id' // Ensure company_id is always provided
  };
}

/**
 * Process participants data from database format
 */
export function processParticipants(participants: any): TrainingParticipant[] | undefined {
  if (!participants) return undefined;
  
  try {
    if (typeof participants === 'string') {
      participants = JSON.parse(participants);
    }
    
    if (Array.isArray(participants)) {
      return participants.map(p => ({
        id: p.id,
        name: p.name,
        status: p.status || 'confirmed',
        attended: p.attended
      }));
    }
    
    return undefined;
  } catch (e) {
    console.error("Error processing participants:", e);
    return undefined;
  }
}
