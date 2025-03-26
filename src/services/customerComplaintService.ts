
import { supabase } from "@/integrations/supabase/client";

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
  };
}

export async function createCustomerComplaint(complaint: Omit<CustomerComplaint, 'id' | 'created_at' | 'updated_at' | 'closed_at'>): Promise<CustomerComplaint> {
  const { data, error } = await supabase
    .from('customer_complaints')
    .insert([complaint])
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
