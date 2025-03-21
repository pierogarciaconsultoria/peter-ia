
import { supabase } from "@/integrations/supabase/client";

export interface NonConformingProduct {
  id: string;
  product_name: string;
  description: string;
  status: 'identified' | 'in_progress' | 'resolved' | 'approved' | 'rejected';
  severity: 'low' | 'medium' | 'high' | 'critical';
  requirement_id: string;
  department: string;
  customer?: string;
  non_conformity_type: string;
  immediate_action: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export async function getNonConformingProducts(): Promise<NonConformingProduct[]> {
  const { data, error } = await supabase
    .from('non_conforming_products')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching non-conforming products:", error);
    throw new Error(error.message);
  }
  
  return data || [];
}

export async function getNonConformingProductById(id: string): Promise<NonConformingProduct> {
  const { data, error } = await supabase
    .from('non_conforming_products')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error("Error fetching non-conforming product:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function createNonConformingProduct(product: Omit<NonConformingProduct, 'id' | 'created_at' | 'updated_at'>): Promise<NonConformingProduct> {
  const { data, error } = await supabase
    .from('non_conforming_products')
    .insert([product])
    .select()
    .single();
  
  if (error) {
    console.error("Error creating non-conforming product:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateNonConformingProduct(id: string, product: Partial<Omit<NonConformingProduct, 'id' | 'created_at' | 'updated_at'>>): Promise<NonConformingProduct> {
  const { data, error } = await supabase
    .from('non_conforming_products')
    .update({
      ...product,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating non-conforming product:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function deleteNonConformingProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from('non_conforming_products')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting non-conforming product:", error);
    throw new Error(error.message);
  }
}
