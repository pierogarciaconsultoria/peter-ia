
import { supabase } from "@/integrations/supabase/client";

export interface SatisfactionSurvey {
  id: string;
  title: string;
  customer_name: string;
  survey_date: string;
  overall_satisfaction?: number;
  product_quality?: number;
  service_quality?: number;
  delivery_satisfaction?: number;
  suggestions?: string;
  status: 'draft' | 'sent' | 'completed';
  created_at: string;
  updated_at: string;
}

export async function getSatisfactionSurveys(): Promise<SatisfactionSurvey[]> {
  const { data, error } = await supabase
    .from('customer_satisfaction_surveys')
    .select('*')
    .order('survey_date', { ascending: false });
  
  if (error) {
    console.error("Error fetching satisfaction surveys:", error);
    throw new Error(error.message);
  }
  
  return (data || []).map(item => ({
    ...item,
    status: item.status as SatisfactionSurvey['status'],
  }));
}

export async function getSatisfactionSurveyById(id: string): Promise<SatisfactionSurvey> {
  const { data, error } = await supabase
    .from('customer_satisfaction_surveys')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error("Error fetching satisfaction survey:", error);
    throw new Error(error.message);
  }
  
  return {
    ...data,
    status: data.status as SatisfactionSurvey['status'],
  };
}

export async function createSatisfactionSurvey(survey: Omit<SatisfactionSurvey, 'id' | 'created_at' | 'updated_at'>): Promise<SatisfactionSurvey> {
  const { data, error } = await supabase
    .from('customer_satisfaction_surveys')
    .insert([survey])
    .select()
    .single();
  
  if (error) {
    console.error("Error creating satisfaction survey:", error);
    throw new Error(error.message);
  }
  
  return {
    ...data,
    status: data.status as SatisfactionSurvey['status'],
  };
}

export async function updateSatisfactionSurvey(id: string, survey: Partial<Omit<SatisfactionSurvey, 'id' | 'created_at' | 'updated_at'>>): Promise<SatisfactionSurvey> {
  const { data, error } = await supabase
    .from('customer_satisfaction_surveys')
    .update({
      ...survey,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating satisfaction survey:", error);
    throw new Error(error.message);
  }
  
  return {
    ...data,
    status: data.status as SatisfactionSurvey['status'],
  };
}

export async function deleteSatisfactionSurvey(id: string): Promise<void> {
  const { error } = await supabase
    .from('customer_satisfaction_surveys')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting satisfaction survey:", error);
    throw new Error(error.message);
  }
}
