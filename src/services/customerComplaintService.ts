
import { supabase } from "@/integrations/supabase/client";
import { generateRandomCode } from "@/utils/codeGenerator";

export interface CustomerComplaint {
  id: string;
  customer_name: string;
  contact_email?: string;
  contact_phone?: string;
  complaint_date: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigned_to?: string;
  resolution?: string;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  invoice_number?: string;
  product?: string;
  return_deadline?: string;
  identification_code?: string;
  treatment_option?: 'return' | 'credit' | 'warranty' | 'other';
  action_schedule_id?: string;
  detailed_status?: 'nova_reclamacao' | 'analise_reclamacao' | 'identificacao_causa' | 'acao' | 'acompanhamento' | 'conclusao';
}

export async function getCustomerComplaints(): Promise<CustomerComplaint[]> {
  const { data, error } = await supabase
    .from('customer_complaints')
    .select('*')
    .order('complaint_date', { ascending: false });
  
  if (error) {
    console.error("Error fetching customer complaints:", error);
    throw new Error(error.message);
  }
  
  return (data || []).map(item => ({
    ...item,
    status: item.status as CustomerComplaint['status'],
    priority: item.priority as CustomerComplaint['priority'],
    // Use optional chaining to safely access potentially undefined properties
    treatment_option: item.treatment_option as CustomerComplaint['treatment_option'] || undefined,
    detailed_status: item.detailed_status as CustomerComplaint['detailed_status'] || 'nova_reclamacao',
  }));
}

export async function getCustomerComplaintById(id: string): Promise<CustomerComplaint> {
  const { data, error } = await supabase
    .from('customer_complaints')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error("Error fetching customer complaint:", error);
    throw new Error(error.message);
  }
  
  return {
    ...data,
    status: data.status as CustomerComplaint['status'],
    priority: data.priority as CustomerComplaint['priority'],
    // Use optional chaining to safely access potentially undefined properties
    treatment_option: data.treatment_option as CustomerComplaint['treatment_option'] || undefined,
    detailed_status: data.detailed_status as CustomerComplaint['detailed_status'] || 'nova_reclamacao',
  };
}

export async function createCustomerComplaint(complaint: Omit<CustomerComplaint, 'id' | 'created_at' | 'updated_at' | 'closed_at'>): Promise<CustomerComplaint> {
  // Gerar um código de identificação automático se não foi informado
  const complaintWithCode = {
    ...complaint,
    identification_code: complaint.identification_code || generateRandomCode('RC')
  };

  const { data, error } = await supabase
    .from('customer_complaints')
    .insert([complaintWithCode])
    .select()
    .single();
  
  if (error) {
    console.error("Error creating customer complaint:", error);
    throw new Error(error.message);
  }
  
  return {
    ...data,
    status: data.status as CustomerComplaint['status'],
    priority: data.priority as CustomerComplaint['priority'],
    // Use optional chaining to safely access potentially undefined properties
    treatment_option: data.treatment_option as CustomerComplaint['treatment_option'] || undefined,
    detailed_status: data.detailed_status as CustomerComplaint['detailed_status'] || 'nova_reclamacao',
  };
}

export async function updateCustomerComplaint(id: string, complaint: Partial<Omit<CustomerComplaint, 'id' | 'created_at' | 'updated_at'>>): Promise<CustomerComplaint> {
  const updates: any = {
    ...complaint,
    updated_at: new Date().toISOString()
  };
  
  if (complaint.status === 'closed' && !complaint.closed_at) {
    updates.closed_at = new Date().toISOString();
  }
  
  const { data, error } = await supabase
    .from('customer_complaints')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating customer complaint:", error);
    throw new Error(error.message);
  }
  
  return {
    ...data,
    status: data.status as CustomerComplaint['status'],
    priority: data.priority as CustomerComplaint['priority'],
    // Use optional chaining to safely access potentially undefined properties
    treatment_option: data.treatment_option as CustomerComplaint['treatment_option'] || undefined,
    detailed_status: data.detailed_status as CustomerComplaint['detailed_status'] || 'nova_reclamacao',
  };
}

export async function deleteCustomerComplaint(id: string): Promise<void> {
  const { error } = await supabase
    .from('customer_complaints')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting customer complaint:", error);
    throw new Error(error.message);
  }
}

// Update complaint detailed status (specific function for kanban)
export async function updateComplaintDetailedStatus(
  id: string, 
  detailed_status: CustomerComplaint['detailed_status']
): Promise<CustomerComplaint> {
  return updateCustomerComplaint(id, { detailed_status });
}
