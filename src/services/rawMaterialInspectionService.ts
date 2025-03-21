
import { supabase } from "@/integrations/supabase/client";

export interface RawMaterialInspection {
  id: string;
  material_name: string;
  supplier: string;
  batch_number: string;
  inspection_date: string;
  inspector: string;
  inspection_result: 'approved' | 'rejected' | 'conditional';
  quantity: number;
  unit: string;
  parameters?: any;
  observations?: string;
  created_at: string;
  updated_at: string;
}

export async function getRawMaterialInspections(): Promise<RawMaterialInspection[]> {
  const { data, error } = await supabase
    .from('raw_material_inspections')
    .select('*')
    .order('inspection_date', { ascending: false });
  
  if (error) {
    console.error("Error fetching raw material inspections:", error);
    throw new Error(error.message);
  }
  
  return data || [];
}

export async function getRawMaterialInspectionById(id: string): Promise<RawMaterialInspection> {
  const { data, error } = await supabase
    .from('raw_material_inspections')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error("Error fetching raw material inspection:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function createRawMaterialInspection(inspection: Omit<RawMaterialInspection, 'id' | 'created_at' | 'updated_at'>): Promise<RawMaterialInspection> {
  const { data, error } = await supabase
    .from('raw_material_inspections')
    .insert([inspection])
    .select()
    .single();
  
  if (error) {
    console.error("Error creating raw material inspection:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateRawMaterialInspection(id: string, inspection: Partial<Omit<RawMaterialInspection, 'id' | 'created_at' | 'updated_at'>>): Promise<RawMaterialInspection> {
  const { data, error } = await supabase
    .from('raw_material_inspections')
    .update({
      ...inspection,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating raw material inspection:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function deleteRawMaterialInspection(id: string): Promise<void> {
  const { error } = await supabase
    .from('raw_material_inspections')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting raw material inspection:", error);
    throw new Error(error.message);
  }
}
