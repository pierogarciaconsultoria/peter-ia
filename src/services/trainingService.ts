
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
  created_at: string;
  updated_at: string;
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
