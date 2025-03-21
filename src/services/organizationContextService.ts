
import { supabase } from "@/integrations/supabase/client";

export interface OrganizationContext {
  id: string;
  context_type: 'internal_factor' | 'external_factor' | 'interested_party' | 'swot';
  description: string;
  analysis?: string;
  created_by: string;
  update_date: string;
  created_at: string;
  updated_at: string;
}

export async function getOrganizationContexts(): Promise<OrganizationContext[]> {
  const { data, error } = await supabase
    .from('organization_context')
    .select('*')
    .order('update_date', { ascending: false });
  
  if (error) {
    console.error("Error fetching organization contexts:", error);
    throw new Error(error.message);
  }
  
  return data || [];
}

export async function getOrganizationContextById(id: string): Promise<OrganizationContext> {
  const { data, error } = await supabase
    .from('organization_context')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error("Error fetching organization context:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function createOrganizationContext(context: Omit<OrganizationContext, 'id' | 'created_at' | 'updated_at'>): Promise<OrganizationContext> {
  const { data, error } = await supabase
    .from('organization_context')
    .insert([context])
    .select()
    .single();
  
  if (error) {
    console.error("Error creating organization context:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateOrganizationContext(id: string, context: Partial<Omit<OrganizationContext, 'id' | 'created_at' | 'updated_at'>>): Promise<OrganizationContext> {
  const { data, error } = await supabase
    .from('organization_context')
    .update({
      ...context,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating organization context:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function deleteOrganizationContext(id: string): Promise<void> {
  const { error } = await supabase
    .from('organization_context')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting organization context:", error);
    throw new Error(error.message);
  }
}
