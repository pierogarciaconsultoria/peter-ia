
import { supabase } from "@/integrations/supabase/client";

export type QualityPolicy = {
  id: string;
  policy_text: string;
  company_id: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  // Removido: related_action_plans, related_indicators
};

// Busca a política mais recente para a empresa
export async function fetchQualityPolicy(company_id: string): Promise<QualityPolicy | null> {
  const { data, error } = await supabase
    .from("quality_policy")
    .select("*")
    .eq("company_id", company_id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return null;
  }
  return data as QualityPolicy;
}

// SALVA (insere nova ou atualiza) a política
export async function upsertQualityPolicy(
  company_id: string,
  policy_text: string,
  created_by?: string
  // Parâmetros removidos: related_action_plans, related_indicators
) {
  const { data, error } = await supabase
    .from("quality_policy")
    .upsert(
      [
        {
          company_id,
          policy_text,
          created_by,
          updated_at: new Date().toISOString(),
          // Campos de relação removidos
        }
      ],
      { onConflict: "company_id" }
    )
    .select()
    .maybeSingle();

  if (error) {
    throw error;
  }
  return data as QualityPolicy;
}

