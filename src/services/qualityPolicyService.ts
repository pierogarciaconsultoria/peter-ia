
import { supabase } from "@/integrations/supabase/client";

export type QualityPolicy = {
  id: string;
  policy_text: string;
  company_id: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
};

// BUSCA a política da qualidade (busca mais recente por company_id)
export async function fetchQualityPolicy(company_id: string): Promise<QualityPolicy | null> {
  const { data, error } = await supabase
    .from("quality_policy")
    .select("*")
    .eq("company_id", company_id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();
  if (error || !data) {
    return null;
  }
  return data as QualityPolicy;
}

// SALVA (insere ou atualiza) a política
export async function upsertQualityPolicy(company_id: string, policy_text: string, created_by?: string) {
  const { data, error } = await supabase
    .from("quality_policy")
    .upsert([
      {
        company_id,
        policy_text,
        created_by,
        updated_at: new Date().toISOString(),
      }
    ], { onConflict: "company_id" })
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data as QualityPolicy;
}
