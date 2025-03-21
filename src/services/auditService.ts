
import { supabase } from "@/integrations/supabase/client";

export interface Audit {
  id: string;
  title: string;
  description?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'canceled';
  audit_date: string;
  completion_date?: string;
  responsible: string;
  area: string;
  findings?: string;
  created_at: string;
  updated_at: string;
}

export async function getAudits(): Promise<Audit[]> {
  const { data, error } = await supabase
    .from('audits')
    .select('*')
    .order('audit_date', { ascending: false });
  
  if (error) {
    console.error("Error fetching audits:", error);
    throw new Error(error.message);
  }
  
  return (data || []).map(item => ({
    ...item,
    status: item.status as Audit['status'],
  }));
}

export async function getAuditById(id: string): Promise<Audit> {
  const { data, error } = await supabase
    .from('audits')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error("Error fetching audit:", error);
    throw new Error(error.message);
  }
  
  return {
    ...data,
    status: data.status as Audit['status'],
  };
}

export async function createAudit(audit: Omit<Audit, 'id' | 'created_at' | 'updated_at'>): Promise<Audit> {
  const { data, error } = await supabase
    .from('audits')
    .insert([audit])
    .select()
    .single();
  
  if (error) {
    console.error("Error creating audit:", error);
    throw new Error(error.message);
  }
  
  return {
    ...data,
    status: data.status as Audit['status'],
  };
}

export async function updateAudit(id: string, audit: Partial<Omit<Audit, 'id' | 'created_at' | 'updated_at'>>): Promise<Audit> {
  const { data, error } = await supabase
    .from('audits')
    .update({
      ...audit,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating audit:", error);
    throw new Error(error.message);
  }
  
  return {
    ...data,
    status: data.status as Audit['status'],
  };
}

export async function deleteAudit(id: string): Promise<void> {
  const { error } = await supabase
    .from('audits')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting audit:", error);
    throw new Error(error.message);
  }
}
