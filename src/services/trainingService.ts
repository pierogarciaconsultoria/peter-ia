
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

/**
 * Training interface that extends the Supabase HR training row type
 */
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
  participants?: TrainingParticipant[];
  status: 'planned' | 'in_progress' | 'completed' | 'canceled';
  procedure_id?: string;
  evaluation_method?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Training participant interface
 */
export interface TrainingParticipant {
  id: string;
  name: string;
  status: 'confirmed' | 'in_progress' | 'completed' | 'failed';
  attended?: boolean;
}

/**
 * Type for creating a new training
 */
export type CreateTrainingInput = Omit<Training, 'id' | 'created_at' | 'updated_at'>;

/**
 * Type for updating an existing training
 */
export type UpdateTrainingInput = Partial<Omit<Training, 'id' | 'created_at' | 'updated_at'>>;

/**
 * Filter options for fetching trainings
 */
export interface TrainingFilters {
  department?: string;
  status?: Training['status'];
  employeeId?: string;
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
  page?: number;
  pageSize?: number;
}

/**
 * Fetch all trainings with optional filters
 */
export async function getTrainings(filters?: TrainingFilters): Promise<Training[]> {
  try {
    let query = supabase
      .from('hr_trainings')
      .select('*');
    
    // Apply filters if provided
    if (filters) {
      if (filters.department) {
        query = query.eq('department', filters.department);
      }
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.startDate) {
        query = query.gte('start_date', filters.startDate);
      }
      
      if (filters.endDate) {
        query = query.lte('start_date', filters.endDate);
      }
      
      if (filters.searchQuery) {
        query = query.or(`title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
      }
      
      // Add pagination if specified
      if (filters.page !== undefined && filters.pageSize) {
        const from = filters.page * filters.pageSize;
        const to = from + filters.pageSize - 1;
        query = query.range(from, to);
      }
    }
    
    // Always order by start date descending
    query = query.order('start_date', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching trainings:", error);
      throw new Error(error.message);
    }
    
    // Process the data to ensure it matches our Training interface
    const trainings: Training[] = data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description || undefined,
      trainer: item.instructor || 'A definir',
      training_date: item.start_date,
      start_time: item.start_date,
      end_time: item.end_date || undefined,
      duration: item.duration || 0,
      department: item.department || '',
      participants: processParticipants(item.participants),
      status: item.status as Training['status'],
      procedure_id: item.procedure_id || undefined,
      evaluation_method: item.evaluation_method || undefined,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
    
    return trainings;
  } catch (error) {
    console.error("Error in getTrainings:", error);
    throw error;
  }
}

/**
 * Process participants data from database format
 */
function processParticipants(participants: any): TrainingParticipant[] | undefined {
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

/**
 * Get a training by ID
 */
export async function getTrainingById(id: string): Promise<Training> {
  try {
    const { data, error } = await supabase
      .from('hr_trainings')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching training:", error);
      throw new Error(error.message);
    }
    
    if (!data) {
      throw new Error(`Training with ID ${id} not found`);
    }
    
    // Convert the data to our Training interface
    const training: Training = {
      id: data.id,
      title: data.title,
      description: data.description || undefined,
      trainer: data.instructor || 'A definir',
      training_date: data.start_date,
      start_time: data.start_date,
      end_time: data.end_date || undefined,
      duration: data.duration || 0,
      department: data.department || '',
      participants: processParticipants(data.participants),
      status: data.status as Training['status'],
      procedure_id: data.procedure_id || undefined,
      evaluation_method: data.evaluation_method || undefined,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    return training;
  } catch (error) {
    console.error("Error in getTrainingById:", error);
    throw error;
  }
}

/**
 * Create a new training
 */
export async function createTraining(trainingData: CreateTrainingInput): Promise<Training> {
  try {
    // Validate required fields
    if (!trainingData.title || !trainingData.training_date || !trainingData.trainer || !trainingData.department) {
      throw new Error("Missing required training data");
    }
    
    // Format the data for the database
    const dbData = {
      title: trainingData.title,
      description: trainingData.description,
      instructor: trainingData.trainer,
      start_date: trainingData.training_date,
      end_date: trainingData.end_time,
      duration: trainingData.duration,
      department: trainingData.department,
      participants: trainingData.participants,
      status: trainingData.status,
      procedure_id: trainingData.procedure_id,
      evaluation_method: trainingData.evaluation_method,
      type: 'standard' // Default value for required field
    };
    
    const { data, error } = await supabase
      .from('hr_trainings')
      .insert([dbData])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating training:", error);
      throw new Error(error.message);
    }
    
    // Convert the returned data to our Training interface
    const newTraining: Training = {
      id: data.id,
      title: data.title,
      description: data.description || undefined,
      trainer: data.instructor || 'A definir',
      training_date: data.start_date,
      start_time: data.start_date,
      end_time: data.end_date || undefined,
      duration: data.duration || 0,
      department: data.department || '',
      participants: processParticipants(data.participants),
      status: data.status as Training['status'],
      procedure_id: data.procedure_id || undefined,
      evaluation_method: data.evaluation_method || undefined,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    return newTraining;
  } catch (error) {
    console.error("Error in createTraining:", error);
    throw error;
  }
}

/**
 * Update an existing training
 */
export async function updateTraining(id: string, trainingData: UpdateTrainingInput): Promise<Training> {
  try {
    // Create update data object
    const updateData: any = {};
    
    if (trainingData.title) updateData.title = trainingData.title;
    if (trainingData.description !== undefined) updateData.description = trainingData.description;
    if (trainingData.trainer) updateData.instructor = trainingData.trainer;
    if (trainingData.training_date) updateData.start_date = trainingData.training_date;
    if (trainingData.end_time) updateData.end_date = trainingData.end_time;
    if (trainingData.duration !== undefined) updateData.duration = trainingData.duration;
    if (trainingData.department) updateData.department = trainingData.department;
    if (trainingData.participants !== undefined) updateData.participants = trainingData.participants;
    if (trainingData.status) updateData.status = trainingData.status;
    if (trainingData.procedure_id !== undefined) updateData.procedure_id = trainingData.procedure_id;
    if (trainingData.evaluation_method !== undefined) updateData.evaluation_method = trainingData.evaluation_method;
    
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
    
    // Convert the returned data to our Training interface
    const updatedTraining: Training = {
      id: data.id,
      title: data.title,
      description: data.description || undefined,
      trainer: data.instructor || 'A definir',
      training_date: data.start_date,
      start_time: data.start_date,
      end_time: data.end_date || undefined,
      duration: data.duration || 0,
      department: data.department || '',
      participants: processParticipants(data.participants),
      status: data.status as Training['status'],
      procedure_id: data.procedure_id || undefined,
      evaluation_method: data.evaluation_method || undefined,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    return updatedTraining;
  } catch (error) {
    console.error("Error in updateTraining:", error);
    throw error;
  }
}

/**
 * Delete a training by ID
 */
export async function deleteTraining(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('hr_trainings')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting training:", error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error in deleteTraining:", error);
    throw error;
  }
}

/**
 * Get trainings by department
 */
export async function getTrainingsByDepartment(department: string): Promise<Training[]> {
  return getTrainings({ department });
}

/**
 * Get trainings by status
 */
export async function getTrainingsByStatus(status: Training['status']): Promise<Training[]> {
  return getTrainings({ status });
}

/**
 * Get trainings for a specific employee
 */
export async function getTrainingsForEmployee(employeeId: string): Promise<Training[]> {
  try {
    const { data, error } = await supabase
      .from('hr_trainings')
      .select('*')
      .contains('participants', [{ id: employeeId }])
      .order('start_date', { ascending: false });
    
    if (error) {
      console.error("Error fetching employee trainings:", error);
      throw new Error(error.message);
    }
    
    // Convert the data to our Training interface
    const trainings: Training[] = data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description || undefined,
      trainer: item.instructor || 'A definir',
      training_date: item.start_date,
      start_time: item.start_date,
      end_time: item.end_date || undefined,
      duration: item.duration || 0,
      department: item.department || '',
      participants: processParticipants(item.participants),
      status: item.status as Training['status'],
      procedure_id: item.procedure_id || undefined,
      evaluation_method: item.evaluation_method || undefined,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
    
    return trainings;
  } catch (error) {
    console.error("Error in getTrainingsForEmployee:", error);
    throw error;
  }
}

/**
 * Generate trainings for an employee based on job position requirements
 */
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
      
      // Convert the returned data to our Training interface
      const newTraining: Training = {
        id: data.id,
        title: data.title,
        description: data.description || undefined,
        trainer: data.instructor || 'A definir',
        training_date: data.start_date,
        start_time: data.start_date,
        end_time: data.end_date || undefined,
        duration: data.duration || 0,
        department: data.department || '',
        participants: processParticipants(data.participants),
        status: data.status as Training['status'],
        procedure_id: data.procedure_id || undefined,
        evaluation_method: data.evaluation_method || undefined,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      trainings.push(newTraining);
    }
    
    return trainings;
  } catch (error) {
    console.error("Error generating trainings for employee:", error);
    throw error;
  }
}
