
import { supabase } from "@/integrations/supabase/client";

export interface ExternalAudit {
  id: string;
  title: string;
  description?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'canceled';
  audit_date: string;
  completion_date?: string;
  external_auditor: string;
  auditor_company?: string;
  findings?: string;
  report_url?: string;
  created_at: string;
  updated_at: string;
}

export async function getExternalAudits(): Promise<ExternalAudit[]> {
  const { data, error } = await supabase
    .from('external_audits')
    .select('*')
    .order('audit_date', { ascending: false });
  
  if (error) {
    console.error("Error fetching external audits:", error);
    throw new Error(error.message);
  }
  
  return (data || []).map(item => ({
    ...item,
    status: item.status as ExternalAudit['status'],
  }));
}

export async function getExternalAuditById(id: string): Promise<ExternalAudit> {
  const { data, error } = await supabase
    .from('external_audits')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error("Error fetching external audit:", error);
    throw new Error(error.message);
  }
  
  return {
    ...data,
    status: data.status as ExternalAudit['status'],
  };
}

export async function createExternalAudit(audit: Omit<ExternalAudit, 'id' | 'created_at' | 'updated_at'>): Promise<ExternalAudit> {
  const { data, error } = await supabase
    .from('external_audits')
    .insert([audit])
    .select()
    .single();
  
  if (error) {
    console.error("Error creating external audit:", error);
    throw new Error(error.message);
  }
  
  return {
    ...data,
    status: data.status as ExternalAudit['status'],
  };
}

export async function updateExternalAudit(id: string, audit: Partial<Omit<ExternalAudit, 'id' | 'created_at' | 'updated_at'>>): Promise<ExternalAudit> {
  const { data, error } = await supabase
    .from('external_audits')
    .update({
      ...audit,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating external audit:", error);
    throw new Error(error.message);
  }
  
  return {
    ...data,
    status: data.status as ExternalAudit['status'],
  };
}

export async function deleteExternalAudit(id: string): Promise<void> {
  const { error } = await supabase
    .from('external_audits')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting external audit:", error);
    throw new Error(error.message);
  }
}

export async function uploadAuditReport(file: File, auditId: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${auditId}-${Date.now()}.${fileExt}`;
  const filePath = `audit-reports/${fileName}`;
  
  const { error } = await supabase.storage
    .from('documents')
    .upload(filePath, file);
  
  if (error) {
    console.error("Error uploading audit report:", error);
    throw new Error(error.message);
  }
  
  const { data } = supabase.storage
    .from('documents')
    .getPublicUrl(filePath);
  
  return data.publicUrl;
}
