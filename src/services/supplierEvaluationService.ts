
import { supabase } from "@/integrations/supabase/client";

export interface SupplierEvaluation {
  id: string;
  supplier_name: string;
  evaluation_date: string;
  evaluator: string;
  category: string;
  quality_score?: number;
  delivery_score?: number;
  price_score?: number;
  support_score?: number;
  total_score?: number;
  status: 'active' | 'inactive';
  comments?: string;
  created_at: string;
  updated_at: string;
}

export async function getSupplierEvaluations(): Promise<SupplierEvaluation[]> {
  const { data, error } = await supabase
    .from('supplier_evaluations')
    .select('*')
    .order('evaluation_date', { ascending: false });
  
  if (error) {
    console.error("Error fetching supplier evaluations:", error);
    throw new Error(error.message);
  }
  
  return (data || []).map(item => ({
    ...item,
    status: item.status as SupplierEvaluation['status'],
  }));
}

export async function getSupplierEvaluationById(id: string): Promise<SupplierEvaluation> {
  const { data, error } = await supabase
    .from('supplier_evaluations')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error("Error fetching supplier evaluation:", error);
    throw new Error(error.message);
  }
  
  return {
    ...data,
    status: data.status as SupplierEvaluation['status'],
  };
}

export async function createSupplierEvaluation(evaluation: Omit<SupplierEvaluation, 'id' | 'created_at' | 'updated_at'>): Promise<SupplierEvaluation> {
  const { data, error } = await supabase
    .from('supplier_evaluations')
    .insert([evaluation])
    .select()
    .single();
  
  if (error) {
    console.error("Error creating supplier evaluation:", error);
    throw new Error(error.message);
  }
  
  return {
    ...data,
    status: data.status as SupplierEvaluation['status'],
  };
}

export async function updateSupplierEvaluation(id: string, evaluation: Partial<Omit<SupplierEvaluation, 'id' | 'created_at' | 'updated_at'>>): Promise<SupplierEvaluation> {
  const { data, error } = await supabase
    .from('supplier_evaluations')
    .update({
      ...evaluation,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating supplier evaluation:", error);
    throw new Error(error.message);
  }
  
  return {
    ...data,
    status: data.status as SupplierEvaluation['status'],
  };
}

export async function deleteSupplierEvaluation(id: string): Promise<void> {
  const { error } = await supabase
    .from('supplier_evaluations')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting supplier evaluation:", error);
    throw new Error(error.message);
  }
}
