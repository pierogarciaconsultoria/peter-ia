
import { supabase } from "@/integrations/supabase/client";

// Quality Inspection Types
export interface QualityCriteriaResult {
  criteria_id?: string;
  criteria_name: string;
  expected_value: string;
  actual_value: string;
  is_conforming: boolean;
  observation?: string;
}

export interface QualityInspection {
  id: string;
  created_at: string;
  updated_at: string;
  inspection_date: string;
  product_name: string;
  batch_number: string;
  inspector: string;
  status: "approved" | "rejected" | "with_observations";
  inspection_type: "process" | "final";
  process_name?: string;
  criteria_results: QualityCriteriaResult[];
  observations?: string;
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
  category: string;
  company_segment: string;
  is_active: boolean;
}

// Service functions (todas ligadas ao Supabase!)
export async function getQualityInspections(): Promise<QualityInspection[]> {
  const { data, error } = await supabase
    .from("quality_inspections")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar inspeções de qualidade:", error.message);
    return [];
  }
  // Critérios resultados precisa ser parsed de JSON
  return (data || []).map((item) => ({
    ...item,
    criteria_results:
      typeof item.criteria_results === "string"
        ? JSON.parse(item.criteria_results)
        : item.criteria_results || [],
    inspection_date: item.inspection_date,
    created_at: item.created_at,
    updated_at: item.updated_at,
  })) as QualityInspection[];
}

export async function getQualityInspectionById(id: string): Promise<QualityInspection | null> {
  const { data, error } = await supabase
    .from("quality_inspections")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar inspeção por ID:", error.message);
    return null;
  }
  if (!data) return null;

  return {
    ...data,
    criteria_results:
      typeof data.criteria_results === "string"
        ? JSON.parse(data.criteria_results)
        : data.criteria_results || [],
    inspection_date: data.inspection_date,
    created_at: data.created_at,
    updated_at: data.updated_at,
  } as QualityInspection;
}

export async function createQualityInspection(inspection: Omit<QualityInspection, "id" | "created_at" | "updated_at">): Promise<QualityInspection | null> {
  // Salva inspection + criteria_results serializado
  // O Supabase já serializa o objeto JS como JSON para campos JSONB, não precisa stringify!
  const { data, error } = await supabase
    .from("quality_inspections")
    .insert([
      {
        ...inspection,
        criteria_results: inspection.criteria_results as any, // Deixa Supabase serializar o array automaticamente
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar inspeção de qualidade:", error.message);
    return null;
  }
  return {
    ...data,
    criteria_results:
      typeof data.criteria_results === "string"
        ? JSON.parse(data.criteria_results)
        : data.criteria_results || [],
    inspection_date: data.inspection_date,
    created_at: data.created_at,
    updated_at: data.updated_at,
  } as QualityInspection;
}

export async function updateQualityInspection(id: string, updates: Partial<QualityInspection>): Promise<QualityInspection | null> {
  // Atualiza e salva o criteria_results corretamente
  const payload = {
    ...updates,
    ...(updates.criteria_results !== undefined
      ? { criteria_results: updates.criteria_results as any } // Só passa o array literal/objeto, sem JSON.stringify()
      : {})
  };
  const { data, error } = await supabase
    .from("quality_inspections")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar inspeção de qualidade:", error.message);
    return null;
  }
  return {
    ...data,
    criteria_results:
      typeof data.criteria_results === "string"
        ? JSON.parse(data.criteria_results)
        : data.criteria_results || [],
    inspection_date: data.inspection_date,
    created_at: data.created_at,
    updated_at: data.updated_at,
  } as QualityInspection;
}

export async function deleteQualityInspection(id: string): Promise<void> {
  const { error } = await supabase
    .from("quality_inspections")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erro ao deletar inspeção de qualidade:", error.message);
  }
}

// Quality Criteria functions
export async function getQualityCriteria(): Promise<QualityCriteria[]> {
  const { data, error } = await supabase
    .from("quality_criteria")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar critérios de qualidade:", error.message);
    return [];
  }
  return (data || []) as QualityCriteria[];
}

export async function getQualityCriteriaById(id: string): Promise<QualityCriteria | null> {
  const { data, error } = await supabase
    .from("quality_criteria")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar critério por ID:", error.message);
    return null;
  }
  return data as QualityCriteria;
}

export async function createQualityCriteria(criteria: Omit<QualityCriteria, "id" | "created_at" | "updated_at">): Promise<QualityCriteria | null> {
  const { data, error } = await supabase
    .from("quality_criteria")
    .insert([criteria])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar critério de qualidade:", error.message);
    return null;
  }
  return data as QualityCriteria;
}

export async function updateQualityCriteria(id: string, updates: Partial<QualityCriteria>): Promise<QualityCriteria | null> {
  const { data, error } = await supabase
    .from("quality_criteria")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar critério de qualidade:", error.message);
    return null;
  }
  return data as QualityCriteria;
}

export async function deleteQualityCriteria(id: string): Promise<void> {
  const { error } = await supabase
    .from("quality_criteria")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erro ao deletar critério de qualidade:", error.message);
  }
}
