import { supabase } from "@/integrations/supabase/client";
import { StrategicIdentity, StrategicSource } from "@/types/strategic-planning";

/** Identidade estratégica da empresa do usuário logado (uma por empresa). */
export async function getStrategicIdentity(): Promise<StrategicIdentity | null> {
  const { data, error } = await supabase
    .from('strategic_identities')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching strategic identity:", error);
    throw new Error(error.message);
  }
  return data as StrategicIdentity | null;
}

export interface UpdateStrategicIdentityInput {
  mission?: string;
  vision?: string;
  values?: string[];
  ultimate_goal?: string;
  horizon_date?: string | null;
  source?: StrategicSource;
}

/** Cria ou atualiza a identidade da empresa (company_id vem do banco via RLS). */
export async function updateStrategicIdentity(identity: UpdateStrategicIdentityInput): Promise<StrategicIdentity | null> {
  const existing = await getStrategicIdentity();
  const payload = {
    mission: identity.mission ?? existing?.mission ?? '',
    vision: identity.vision ?? existing?.vision ?? '',
    values: identity.values ?? existing?.values ?? [],
    ultimate_goal: identity.ultimate_goal ?? existing?.ultimate_goal ?? '',
    horizon_date: identity.horizon_date === undefined ? (existing?.horizon_date ?? null) : identity.horizon_date,
    source: identity.source ?? 'manual',
  };

  const query = existing
    ? supabase.from('strategic_identities').update(payload).eq('id', existing.id)
    : supabase.from('strategic_identities').insert(payload);

  const { data, error } = await query.select().single();

  if (error) {
    console.error("Error saving strategic identity:", error);
    throw new Error(error.message);
  }
  return data as StrategicIdentity;
}
