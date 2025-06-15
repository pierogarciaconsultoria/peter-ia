
import { supabase } from "@/integrations/supabase/client";

// Define the frontend type
export type QualityObjective = {
  id: string;
  title: string;
  description?: string;
  target_value?: number;
  unit?: string;
  status: "ativo" | "inativo" | "concluido";
  company_id: string;
  created_at: string;
  updated_at: string;
  frequency?: string;
  created_by?: string;
};

// Helpers to map Supabase (db) <-> Frontend
function fromDb(obj: any): QualityObjective {
  return {
    id: obj.id,
    title: obj.name,
    description: obj.description,
    target_value: obj.target,
    unit: obj.unit,
    status: obj.status,
    company_id: obj.company_id,
    created_at: obj.created_at,
    updated_at: obj.updated_at,
    frequency: obj.frequency,
    created_by: obj.created_by,
  };
}

function toDb(obj: Omit<QualityObjective, "id" | "created_at" | "updated_at">) {
  return {
    name: obj.title,
    description: obj.description,
    target: obj.target_value,
    unit: obj.unit,
    status: obj.status,
    company_id: obj.company_id,
    frequency: obj.frequency,
    created_by: obj.created_by,
  };
}

export async function fetchQualityObjectives(): Promise<QualityObjective[]> {
  const { data, error } = await supabase
    .from("quality_objectives")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Erro ao buscar objetivos da qualidade:", error);
    return [];
  }
  return (data as any[]).map(fromDb);
}

export async function createQualityObjective(
  obj: Omit<QualityObjective, "id" | "created_at" | "updated_at">
): Promise<QualityObjective | null> {
  const { data, error } = await supabase
    .from("quality_objectives")
    .insert([toDb(obj)])
    .select()
    .single();
  if (error) {
    console.error("Erro ao criar objetivo da qualidade:", error);
    return null;
  }
  return fromDb(data);
}

export async function updateQualityObjective(
  id: string,
  updates: Partial<Omit<QualityObjective, "id" | "created_at" | "updated_at">>
): Promise<QualityObjective | null> {
  const { data, error } = await supabase
    .from("quality_objectives")
    .update(toDb(updates as any))
    .eq("id", id)
    .select()
    .single();
  if (error) {
    console.error("Erro ao atualizar objetivo da qualidade:", error);
    return null;
  }
  return fromDb(data);
}

export async function deleteQualityObjective(id: string): Promise<boolean> {
  const { error } = await supabase.from("quality_objectives").delete().eq("id", id);
  if (error) {
    console.error("Erro ao excluir objetivo da qualidade:", error);
    return false;
  }
  return true;
}
