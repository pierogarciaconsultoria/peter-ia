
import { supabase } from "@/integrations/supabase/client";

export interface CriticalAnalysisInput {
  previousActionsStatus?: string;
  externalInternalChanges?: string;
  performanceInfo?: string;
  resourceSufficiency?: string;
  riskActionsEffectiveness?: string;
  improvementOpportunities?: string;
}

export interface CriticalAnalysisResult {
  improvementResults?: string;
  systemChangeNeeds?: string;
  resourceNeeds?: string;
  results?: string;
}

export interface CriticalAnalysis {
  id: string;
  title: string;
  analysis_date: string;
  participants: string[];
  status: 'draft' | 'in_progress' | 'completed';
  inputs?: CriticalAnalysisInput;
  results?: CriticalAnalysisResult;
  attachments?: any;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export async function getCriticalAnalyses(): Promise<CriticalAnalysis[]> {
  const { data, error } = await supabase
    .from('critical_analysis')
    .select('*')
    .order('analysis_date', { ascending: false });
  
  if (error) {
    console.error("Error fetching critical analyses:", error);
    throw new Error(error.message);
  }
  
  return data || [];
}

export async function getCriticalAnalysisById(id: string): Promise<CriticalAnalysis> {
  const { data, error } = await supabase
    .from('critical_analysis')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error("Error fetching critical analysis:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function createCriticalAnalysis(analysis: Omit<CriticalAnalysis, 'id' | 'created_at' | 'updated_at'>): Promise<CriticalAnalysis> {
  const { data, error } = await supabase
    .from('critical_analysis')
    .insert([analysis])
    .select()
    .single();
  
  if (error) {
    console.error("Error creating critical analysis:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateCriticalAnalysis(id: string, analysis: Partial<Omit<CriticalAnalysis, 'id' | 'created_at' | 'updated_at'>>): Promise<CriticalAnalysis> {
  const { data, error } = await supabase
    .from('critical_analysis')
    .update({
      ...analysis,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating critical analysis:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function deleteCriticalAnalysis(id: string): Promise<void> {
  const { error } = await supabase
    .from('critical_analysis')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting critical analysis:", error);
    throw new Error(error.message);
  }
}
