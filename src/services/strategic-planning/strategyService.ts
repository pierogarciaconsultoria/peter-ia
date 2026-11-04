import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";
import { getStrategicIdentity } from "./strategicIdentityService";
import { BscPerspectiveKey } from "@/types/strategic-planning";

export type StrategyPillar = Omit<Tables<'strategy_pillars'>, 'bsc_perspective'> & { bsc_perspective: BscPerspectiveKey | null };
export type StrategyPillarInput = Omit<TablesInsert<'strategy_pillars'>, 'id' | 'company_id' | 'created_at' | 'updated_at'>;

export const MAX_PILLARS = 5;

export interface Strategy {
  ultimate_goal: string;
  horizon_date: string | null;
  mission: string;
  vision: string;
  values: string[];
}

/** Objetivo final, horizonte e identidade (missão, visão, valores) da empresa. */
export async function getStrategy(): Promise<Strategy | null> {
  const identity = await getStrategicIdentity();
  if (!identity) return null;
  return {
    ultimate_goal: identity.ultimate_goal ?? '',
    horizon_date: identity.horizon_date ?? null,
    mission: identity.mission,
    vision: identity.vision,
    values: identity.values,
  };
}

/** Cria ou atualiza objetivo final e horizonte (a identidade é uma por empresa). */
export async function updateStrategy(input: { ultimate_goal: string; horizon_date: string | null }): Promise<void> {
  const existing = await getStrategicIdentity();
  const query = existing
    ? supabase.from('strategic_identities').update(input).eq('id', existing.id)
    : supabase.from('strategic_identities').insert(input);
  const { error } = await query;
  if (error) {
    console.error("Error saving strategy:", error);
    throw new Error(error.message);
  }
}

export async function getPillars(): Promise<StrategyPillar[]> {
  const { data, error } = await supabase
    .from('strategy_pillars')
    .select('*')
    .order('position', { ascending: true })
    .order('created_at', { ascending: true });
  if (error) {
    console.error("Error fetching pillars:", error);
    throw new Error(error.message);
  }
  return (data ?? []) as StrategyPillar[];
}

export async function createPillar(input: StrategyPillarInput): Promise<StrategyPillar> {
  const { data, error } = await supabase.from('strategy_pillars').insert(input).select().single();
  if (error) {
    console.error("Error creating pillar:", error);
    throw new Error(error.message);
  }
  return data as StrategyPillar;
}

export async function updatePillar(id: string, input: Partial<StrategyPillarInput>): Promise<StrategyPillar> {
  const { data, error } = await supabase.from('strategy_pillars').update(input).eq('id', id).select().single();
  if (error) {
    console.error("Error updating pillar:", error);
    throw new Error(error.message);
  }
  return data as StrategyPillar;
}

export async function deletePillar(id: string): Promise<void> {
  const { error } = await supabase.from('strategy_pillars').delete().eq('id', id);
  if (error) {
    console.error("Error deleting pillar:", error);
    throw new Error(error.message);
  }
}
