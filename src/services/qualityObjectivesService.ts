
import { supabase } from "@/integrations/supabase/client";

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
};

export async function fetchQualityObjectives(): Promise<QualityObjective[]> {
  const { data, error } = await supabase
    .from("quality_objectives")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Erro ao buscar objetivos da qualidade:", error);
    return [];
  }
  return data as QualityObjective[];
}

export async function createQualityObjective(
  obj: Omit<QualityObjective, "id" | "created_at" | "updated_at">
): Promise<QualityObjective | null> {
  const { data, error } = await supabase
    .from("quality_objectives")
    .insert([obj])
    .select()
    .single();
  if (error) {
    console.error("Erro ao criar objetivo da qualidade:", error);
    return null;
  }
  return data as QualityObjective;
}

export async function updateQualityObjective(
  id: string,
  updates: Partial<Omit<QualityObjective, "id" | "created_at" | "updated_at">>
): Promise<QualityObjective | null> {
  const { data, error } = await supabase
    .from("quality_objectives")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    console.error("Erro ao atualizar objetivo da qualidade:", error);
    return null;
  }
  return data as QualityObjective;
}

export async function deleteQualityObjective(id: string): Promise<boolean> {
  const { error } = await supabase.from("quality_objectives").delete().eq("id", id);
  if (error) {
    console.error("Erro ao excluir objetivo da qualidade:", error);
    return false;
  }
  return true;
}
