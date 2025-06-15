
import { supabase } from "@/integrations/supabase/client";

// Tipo TypeScript para plano de auditoria
export type AuditPlan = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  responsible: string;
  start_date: string;
  end_date: string;
  audited_areas: string;
  team?: string;
  status: "rascunho" | "planejada" | "em_andamento" | "finalizada";
  summary?: string;
  observations?: string;
  company_id: string;
};

// Buscar todos planos de auditoria da empresa logada
export async function fetchAuditPlans(): Promise<AuditPlan[]> {
  const { data, error } = await supabase
    .from("audit_plans")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Erro ao buscar planos de auditoria:", error);
    return [];
  }
  return data as AuditPlan[];
}

// Criar novo plano de auditoria
export async function createAuditPlan(plan: Omit<AuditPlan, "id" | "created_at" | "updated_at">): Promise<AuditPlan | null> {
  const { data, error } = await supabase
    .from("audit_plans")
    .insert([plan])
    .select()
    .single();
  if (error) {
    console.error("Erro ao criar plano de auditoria:", error);
    return null;
  }
  return data as AuditPlan;
}
