
import { supabase } from "@/integrations/supabase/client";

export type Stakeholder = {
  id: string;
  name: string;
  type: "interno" | "externo";
  category: string;
  influence_level: "baixo" | "médio" | "alto" | "crítico";
  interest_level: "baixo" | "médio" | "alto";
  expectations?: string;
  communication_method?: string;
  contact_info?: string;
  notes?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
};

// Buscar todos stakeholders da empresa logada
export async function fetchStakeholders(): Promise<Stakeholder[]> {
  const { data, error } = await supabase
    .from("stakeholders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Erro ao buscar partes interessadas:", error);
    return [];
  }
  return data as Stakeholder[];
}

// Criar novo stakeholder
export async function createStakeholder(stakeholder: Omit<Stakeholder, "id" | "created_at" | "updated_at">): Promise<Stakeholder | null> {
  const { data, error } = await supabase
    .from("stakeholders")
    .insert([stakeholder])
    .select()
    .single();
  if (error) {
    console.error("Erro ao criar parte interessada:", error);
    return null;
  }
  return data as Stakeholder;
}
