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

export async function getTrainings(): Promise<Training[]> {
  const { data, error } = await supabase
    .from('trainings')
    .select('*')
    .order('training_date', { ascending: false });
  
  if (error) {
    console.error("Error fetching trainings:", error);
    throw new Error(error.message);
  }
  
  return (data || []).map(item => ({
    ...item,
    status: item.status as Training['status'],
  }));
}

export async function getTrainingById(id: string): Promise<Training> {
  const { data, error } = await supabase
    .from('trainings')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error("Error fetching training:", error);
    throw new Error(error.message);
  }
  
  return {
    ...data,
    status: data.status as Training['status'],
  };
}

export async function createTraining(training: Omit<Training, 'id' | 'created_at' | 'updated_at'>): Promise<Training> {
  const { data, error } = await supabase
    .from('trainings')
    .insert([training])
    .select()
    .single();
  
  if (error) {
    console.error("Error creating training:", error);
    throw new Error(error.message);
  }
  
  return {
    ...data,
    status: data.status as Training['status'],
  };
}

export async function updateTraining(id: string, training: Partial<Omit<Training, 'id' | 'created_at' | 'updated_at'>>): Promise<Training> {
  const { data, error } = await supabase
    .from('trainings')
    .update({
      ...training,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating training:", error);
    throw new Error(error.message);
  }
  
  return {
    ...data,
    status: data.status as Training['status'],
  };
}

export async function deleteTraining(id: string): Promise<void> {
  const { error } = await supabase
    .from('trainings')
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
      const newTraining: Omit<Training, 'id' | 'created_at' | 'updated_at'> = {
        title: `Treinamento: ${doc.title}`,
        description: `Treinamento baseado no documento ${doc.document_code || doc.title}`,
        trainer: "A definir",
        training_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        start_time: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end_time: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        duration: 2,
        department: departmentName,
        status: 'planned',
        procedure_id: doc.id,
        evaluation_method: "A definir",
        participants: [
          {
            id: employeeId,
            name: employeeName,
            status: 'confirmed'
          }
        ]
      };
      
      const { data, error } = await supabase
        .from('trainings')
        .insert([newTraining])
        .select()
        .single();
        
      if (error) {
        console.error("Error creating training for document:", doc.title, error);
        continue;
      }
      
      trainings.push({
        ...data,
        status: data.status as Training['status']
      });
    }
    
    return trainings;
  } catch (error) {
    console.error("Error generating trainings for employee:", error);
    throw error;
  }
}
