
import { supabase } from "@/integrations/supabase/client";

export interface Risk {
  id: string;
  title: string;
  description: string;
  category: string;
  process: string;
  probability: number;
  impact: number;
  risk_level?: number;
  mitigation_plan?: string;
  responsible: string;
  status: 'active' | 'mitigated' | 'inactive';
  created_at: string;
  updated_at: string;
}

export async function getRisks(): Promise<Risk[]> {
  const { data, error } = await supabase
    .from('risks')
    .select('*')
    .order('risk_level', { ascending: false });
  
  if (error) {
    console.error("Error fetching risks:", error);
    throw new Error(error.message);
  }
  
  return data || [];
}

export async function getRiskById(id: string): Promise<Risk> {
  const { data, error } = await supabase
    .from('risks')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error("Error fetching risk:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function createRisk(risk: Omit<Risk, 'id' | 'created_at' | 'updated_at'>): Promise<Risk> {
  // Calculate risk level if not provided
  if (!risk.risk_level && risk.probability && risk.impact) {
    risk.risk_level = risk.probability * risk.impact;
  }
  
  const { data, error } = await supabase
    .from('risks')
    .insert([risk])
    .select()
    .single();
  
  if (error) {
    console.error("Error creating risk:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateRisk(id: string, risk: Partial<Omit<Risk, 'id' | 'created_at' | 'updated_at'>>): Promise<Risk> {
  // Recalculate risk level if probability or impact changed
  const updates: any = {
    ...risk,
    updated_at: new Date().toISOString()
  };
  
  if ((risk.probability || risk.impact) && !risk.risk_level) {
    // Get current risk data to ensure we have both values for calculation
    const { data: currentRisk } = await supabase
      .from('risks')
      .select('probability, impact')
      .eq('id', id)
      .single();
    
    if (currentRisk) {
      const probability = risk.probability ?? currentRisk.probability;
      const impact = risk.impact ?? currentRisk.impact;
      updates.risk_level = probability * impact;
    }
  }
  
  const { data, error } = await supabase
    .from('risks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating risk:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function deleteRisk(id: string): Promise<void> {
  const { error } = await supabase
    .from('risks')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting risk:", error);
    throw new Error(error.message);
  }
}
