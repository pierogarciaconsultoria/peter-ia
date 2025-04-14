
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export interface Training {
  id: string;
  title: string;
  description?: string;
  trainer: string;
  training_date: string;
  duration: number;
  department: string;
  participants?: any;
  status: 'planned' | 'in_progress' | 'completed' | 'canceled';
  evaluation_method?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TrainingParticipant {
  id: string;
  name: string;
  status: 'confirmed' | 'in_progress' | 'completed' | 'failed';
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

// New function to generate trainings for a new employee based on job position
export async function generateTrainingsForEmployee(
  employeeId: string, 
  jobPositionId: string, 
  employeeName: string,
  departmentName: string
): Promise<Training[]> {
  try {
    // 1. Get the job position details to find required procedures
    const { data: jobPosition, error: jobError } = await supabase
      .from('job_positions')
      .select('*')
      .eq('id', jobPositionId)
      .single();
    
    if (jobError) throw jobError;
    
    console.log("Job position data:", jobPosition);
    
    // Check if required_procedures exists, if not, log and return empty array
    const requiredProcedures = jobPosition.required_procedures || [];
    if (!Array.isArray(requiredProcedures) || requiredProcedures.length === 0) {
      console.log("No required procedures found for this position:", jobPositionId);
      return [];
    }

    // 2. Get the documents for each required procedure
    const { data: documents, error: docError } = await supabase
      .from('iso_documents')
      .select('*')
      .in('id', requiredProcedures);
      
    if (docError) throw docError;
    
    if (!documents || documents.length === 0) {
      console.log("No documents found for the required procedures:", requiredProcedures);
      return [];
    }
    
    // 3. Create training records for each document
    const trainings: Training[] = [];
    
    for (const doc of documents) {
      // Create a new training record
      const newTraining: Omit<Training, 'id' | 'created_at' | 'updated_at'> = {
        title: `Treinamento: ${doc.title}`,
        description: `Treinamento baseado no documento ${doc.document_code || doc.title}`,
        trainer: "A definir",
        training_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 weeks from now
        duration: 2, // Default 2 hours
        department: departmentName,
        status: 'planned',
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
        continue; // Skip this one but continue with others
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
