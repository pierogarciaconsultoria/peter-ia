
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export interface Training {
  id: string;
  title: string;
  description?: string;
  trainer: string;
  training_date: string;
  start_time?: string;
  end_time?: string;
  duration: number;
  department: string;
  participants?: any;
  status: 'planned' | 'in_progress' | 'completed' | 'canceled';
  procedure_id?: string;
  evaluation_method?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TrainingParticipant {
  id: string;
  name: string;
  status: 'confirmed' | 'in_progress' | 'completed' | 'failed';
  attended?: boolean;
}

// Helper function to map HR training database fields to our Training interface
function mapHrTrainingToTraining(hrTraining: any): Training {
  return {
    id: hrTraining.id,
    title: hrTraining.title,
    description: hrTraining.description,
    trainer: hrTraining.instructor || 'A definir',
    training_date: hrTraining.start_date,
    start_time: hrTraining.start_date,
    end_time: hrTraining.end_date,
    duration: hrTraining.duration || 0,
    department: hrTraining.department || '',
    participants: hrTraining.participants,
    status: hrTraining.status as Training['status'],
    procedure_id: hrTraining.procedure_id,
    evaluation_method: hrTraining.evaluation_method,
    created_at: hrTraining.created_at,
    updated_at: hrTraining.updated_at
  };
}

// Helper function to map our Training interface to HR training database fields
function mapTrainingToHrTraining(training: Omit<Training, 'id' | 'created_at' | 'updated_at'>) {
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
    type: 'standard', // Default value for required field
    company_id: 'default' // This will be set by RLS
  };
}

export async function getTrainings(): Promise<Training[]> {
  const { data, error } = await supabase
    .from('hr_trainings')
    .select('*')
    .order('start_date', { ascending: false });
  
  if (error) {
    console.error("Error fetching trainings:", error);
    throw new Error(error.message);
  }
  
  return (data || []).map(item => mapHrTrainingToTraining(item));
}

export async function getTrainingById(id: string): Promise<Training> {
  const { data, error } = await supabase
    .from('hr_trainings')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error("Error fetching training:", error);
    throw new Error(error.message);
  }
  
  return mapHrTrainingToTraining(data);
}

export async function createTraining(training: Omit<Training, 'id' | 'created_at' | 'updated_at'>): Promise<Training> {
  const hrTraining = mapTrainingToHrTraining(training);
  
  const { data, error } = await supabase
    .from('hr_trainings')
    .insert([hrTraining])
    .select()
    .single();
  
  if (error) {
    console.error("Error creating training:", error);
    throw new Error(error.message);
  }
  
  return mapHrTrainingToTraining(data);
}

export async function updateTraining(id: string, training: Partial<Omit<Training, 'id' | 'created_at' | 'updated_at'>>): Promise<Training> {
  // Create a mapping for partial training update
  const updateData: any = {};
  
  if (training.title) updateData.title = training.title;
  if (training.description !== undefined) updateData.description = training.description;
  if (training.trainer) updateData.instructor = training.trainer;
  if (training.training_date) updateData.start_date = training.training_date;
  if (training.end_time) updateData.end_date = training.end_time;
  if (training.duration !== undefined) updateData.duration = training.duration;
  if (training.department) updateData.department = training.department;
  if (training.participants !== undefined) updateData.participants = training.participants;
  if (training.status) updateData.status = training.status;
  if (training.procedure_id !== undefined) updateData.procedure_id = training.procedure_id;
  if (training.evaluation_method !== undefined) updateData.evaluation_method = training.evaluation_method;
  
  // Always update the updated_at field
  updateData.updated_at = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('hr_trainings')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating training:", error);
    throw new Error(error.message);
  }
  
  return mapHrTrainingToTraining(data);
}

export async function deleteTraining(id: string): Promise<void> {
  const { error } = await supabase
    .from('hr_trainings')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting training:", error);
    throw new Error(error.message);
  }
}

export async function generateTrainingsForEmployee(
  employeeId: string, 
  jobPositionId: string, 
  employeeName: string,
  departmentName: string
): Promise<Training[]> {
  try {
    const { data: jobPosition, error: jobError } = await supabase
      .from('job_positions')
      .select('*')
      .eq('id', jobPositionId)
      .single();
    
    if (jobError) throw jobError;
    
    console.log("Job position data:", jobPosition);
    
    const requiredProcedures = Array.isArray((jobPosition as any).required_procedures) 
      ? (jobPosition as any).required_procedures 
      : [];
      
    if (requiredProcedures.length === 0) {
      console.log("No required procedures found for this position:", jobPositionId);
      return [];
    }

    const { data: documents, error: docError } = await supabase
      .from('iso_documents')
      .select('*')
      .in('id', requiredProcedures);
      
    if (docError) throw docError;
    
    if (!documents || documents.length === 0) {
      console.log("No documents found for the required procedures:", requiredProcedures);
      return [];
    }
    
    const trainings: Training[] = [];
    
    for (const doc of documents) {
      const newTrainingData = {
        title: `Treinamento: ${doc.title}`,
        description: `Treinamento baseado no documento ${doc.document_code || doc.title}`,
        instructor: "A definir", // Map to trainer in our interface
        start_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Map to training_date
        end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        duration: 2,
        department: departmentName,
        status: 'planned' as const,
        procedure_id: doc.id,
        evaluation_method: "A definir",
        participants: [
          {
            id: employeeId,
            name: employeeName,
            status: 'confirmed'
          }
        ],
        type: 'required', // Default value for required field
        company_id: 'default' // This will be set by RLS
      };
      
      const { data, error } = await supabase
        .from('hr_trainings')
        .insert([newTrainingData])
        .select()
        .single();
        
      if (error) {
        console.error("Error creating training for document:", doc.title, error);
        continue;
      }
      
      trainings.push(mapHrTrainingToTraining(data));
    }
    
    return trainings;
  } catch (error) {
    console.error("Error generating trainings for employee:", error);
    throw error;
  }
}
