
import { supabase } from "@/integrations/supabase/client";

export interface NonConformity {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'closed' | 'canceled';
  severity: 'low' | 'medium' | 'high' | 'critical';
  requirement_id: string;
  department: string;
  responsible: string;
  created_at: string;
  updated_at: string;
  closed_at?: string;
}

export async function getNonConformities(): Promise<NonConformity[]> {
  const { data, error } = await supabase
    .from('non_conformities')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching non-conformities:", error);
    throw new Error(error.message);
  }
  
  return data || [];
}

export async function getNonConformityById(id: string): Promise<NonConformity> {
  const { data, error } = await supabase
    .from('non_conformities')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error("Error fetching non-conformity:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function createNonConformity(nonConformity: Omit<NonConformity, 'id' | 'created_at' | 'updated_at' | 'closed_at'>): Promise<NonConformity> {
  const { data, error } = await supabase
    .from('non_conformities')
    .insert([nonConformity])
    .select()
    .single();
  
  if (error) {
    console.error("Error creating non-conformity:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateNonConformity(id: string, nonConformity: Partial<Omit<NonConformity, 'id' | 'created_at' | 'updated_at'>>): Promise<NonConformity> {
  // If status is changing to 'closed', set closed_at date
  const updates: any = {
    ...nonConformity,
    updated_at: new Date().toISOString()
  };
  
  if (nonConformity.status === 'closed' && !nonConformity.closed_at) {
    updates.closed_at = new Date().toISOString();
  }
  
  const { data, error } = await supabase
    .from('non_conformities')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating non-conformity:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function deleteNonConformity(id: string): Promise<void> {
  const { error } = await supabase
    .from('non_conformities')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting non-conformity:", error);
    throw new Error(error.message);
  }
}
