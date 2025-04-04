
import { supabase } from "@/integrations/supabase/client";

export interface QualityInspection {
  id: string;
  created_at: string;
  updated_at: string;
  inspection_date: string;
  product_name: string;
  batch_number: string;
  inspector: string;
  process_name?: string;
  inspection_type: 'process' | 'final';
  status: 'approved' | 'rejected' | 'with_observations';
  observations?: string;
  criteria_results: QualityCriteriaResult[];
}

export interface QualityCriteriaResult {
  criteria_id: string;
  criteria_name: string;
  expected_value: string;
  actual_value: string;
  is_conforming: boolean;
  observation?: string;
}

export interface QualityCriteria {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  expected_value: string;
  tolerance?: string;
  measurement_unit?: string;
  company_segment: string;
  category: string;
  is_active: boolean;
}

export async function getQualityInspections(): Promise<QualityInspection[]> {
  const { data, error } = await supabase
    .from('quality_inspections')
    .select('*')
    .order('inspection_date', { ascending: false });
  
  if (error) {
    console.error("Error fetching quality inspections:", error);
    throw new Error(error.message);
  }
  
  return data || [];
}

export async function getQualityInspectionById(id: string): Promise<QualityInspection> {
  const { data, error } = await supabase
    .from('quality_inspections')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error("Error fetching quality inspection:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function createQualityInspection(inspection: Omit<QualityInspection, 'id' | 'created_at' | 'updated_at'>): Promise<QualityInspection> {
  const { data, error } = await supabase
    .from('quality_inspections')
    .insert([inspection])
    .select()
    .single();
  
  if (error) {
    console.error("Error creating quality inspection:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateQualityInspection(id: string, inspection: Partial<Omit<QualityInspection, 'id' | 'created_at'>>): Promise<QualityInspection> {
  const { data, error } = await supabase
    .from('quality_inspections')
    .update({
      ...inspection,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating quality inspection:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function deleteQualityInspection(id: string): Promise<void> {
  const { error } = await supabase
    .from('quality_inspections')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting quality inspection:", error);
    throw new Error(error.message);
  }
}

export async function getQualityCriteria(segment?: string, category?: string): Promise<QualityCriteria[]> {
  let query = supabase
    .from('quality_criteria')
    .select('*')
    .eq('is_active', true);
    
  if (segment) {
    query = query.eq('company_segment', segment);
  }
  
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query.order('name');
  
  if (error) {
    console.error("Error fetching quality criteria:", error);
    throw new Error(error.message);
  }
  
  return data || [];
}

export async function getQualityCriteriaById(id: string): Promise<QualityCriteria> {
  const { data, error } = await supabase
    .from('quality_criteria')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error("Error fetching quality criteria:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function createQualityCriteria(criteria: Omit<QualityCriteria, 'id' | 'created_at' | 'updated_at'>): Promise<QualityCriteria> {
  const { data, error } = await supabase
    .from('quality_criteria')
    .insert([criteria])
    .select()
    .single();
  
  if (error) {
    console.error("Error creating quality criteria:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateQualityCriteria(id: string, criteria: Partial<Omit<QualityCriteria, 'id' | 'created_at'>>): Promise<QualityCriteria> {
  const { data, error } = await supabase
    .from('quality_criteria')
    .update({
      ...criteria,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating quality criteria:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function deleteQualityCriteria(id: string): Promise<void> {
  const { error } = await supabase
    .from('quality_criteria')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting quality criteria:", error);
    throw new Error(error.message);
  }
}

export const companySegments = [
  { label: "Indústria", value: "industry" },
  { label: "Serviços", value: "services" },
  { label: "Comércio", value: "commerce" },
  { label: "Agricultura", value: "agriculture" },
  { label: "Saúde", value: "healthcare" },
  { label: "Tecnologia", value: "technology" },
  { label: "Educação", value: "education" },
  { label: "Outro", value: "other" },
];

export const criteriaCategories = [
  { label: "Dimensional", value: "dimensional" },
  { label: "Visual", value: "visual" },
  { label: "Funcional", value: "functional" },
  { label: "Desempenho", value: "performance" },
  { label: "Segurança", value: "safety" },
  { label: "Outro", value: "other" },
];
