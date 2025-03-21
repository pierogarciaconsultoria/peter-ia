
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

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

// Helper to safely convert JSON to expected types
function convertInputs(jsonData: Json | null): CriticalAnalysisInput | undefined {
  if (!jsonData) return undefined;
  return jsonData as unknown as CriticalAnalysisInput;
}

function convertResults(jsonData: Json | null): CriticalAnalysisResult | undefined {
  if (!jsonData) return undefined;
  return jsonData as unknown as CriticalAnalysisResult;
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
  
  return (data || []).map(item => ({
    ...item,
    status: item.status as CriticalAnalysis['status'],
    inputs: convertInputs(item.inputs),
    results: convertResults(item.results),
  }));
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
  
  return {
    ...data,
    status: data.status as CriticalAnalysis['status'],
    inputs: convertInputs(data.inputs),
    results: convertResults(data.results),
  };
}

export async function createCriticalAnalysis(analysis: Omit<CriticalAnalysis, 'id' | 'created_at' | 'updated_at'>): Promise<CriticalAnalysis> {
  // Convert the complex objects to JSON for storage
  const dataToInsert = {
    title: analysis.title,
    analysis_date: analysis.analysis_date,
    participants: analysis.participants,
    status: analysis.status,
    inputs: analysis.inputs as unknown as Json,
    results: analysis.results as unknown as Json,
    attachments: analysis.attachments,
    created_by: analysis.created_by
  };

  const { data, error } = await supabase
    .from('critical_analysis')
    .insert([dataToInsert])
    .select()
    .single();
  
  if (error) {
    console.error("Error creating critical analysis:", error);
    throw new Error(error.message);
  }
  
  return {
    ...data,
    status: data.status as CriticalAnalysis['status'],
    inputs: convertInputs(data.inputs),
    results: convertResults(data.results),
  };
}

export async function updateCriticalAnalysis(id: string, analysis: Partial<Omit<CriticalAnalysis, 'id' | 'created_at' | 'updated_at'>>): Promise<CriticalAnalysis> {
  // Convert the complex objects to JSON for storage
  const updates: any = {
    ...analysis,
    updated_at: new Date().toISOString()
  };

  if (analysis.inputs) {
    updates.inputs = analysis.inputs as unknown as Json;
  }
  
  if (analysis.results) {
    updates.results = analysis.results as unknown as Json;
  }
  
  const { data, error } = await supabase
    .from('critical_analysis')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating critical analysis:", error);
    throw new Error(error.message);
  }
  
  return {
    ...data,
    status: data.status as CriticalAnalysis['status'],
    inputs: convertInputs(data.inputs),
    results: convertResults(data.results),
  };
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
