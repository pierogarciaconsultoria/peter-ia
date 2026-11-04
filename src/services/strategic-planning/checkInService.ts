import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export type CheckInConfidence = 'on_track' | 'at_risk' | 'off_track';
export type CheckInEntityType = 'kr' | 'kpi';
export type CheckIn = Omit<Tables<'check_ins'>, 'confidence' | 'entity_type'> & { confidence: CheckInConfidence; entity_type: CheckInEntityType };

export const CONFIDENCE_LABELS: Record<CheckInConfidence, string> = {
  on_track: 'No rumo',
  at_risk: 'Em risco',
  off_track: 'Fora do rumo',
};

export interface CheckInInput {
  entity_type: CheckInEntityType;
  entity_id: string;
  value: number;
  confidence: CheckInConfidence;
  comment?: string;
  /** Para KPI: mês/ano da medição. Padrão: mês atual. */
  month?: number;
  year?: number;
}

/**
 * Registra um check-in e propaga o valor:
 * - resultado-chave: atualiza current_value (o progresso é recalculado pelo banco)
 * - KPI: grava ou atualiza a medição do mês e atualiza os resultados-chave ligados ao indicador
 */
export async function createCheckIn(input: CheckInInput): Promise<CheckIn> {
  const { data, error } = await supabase
    .from('check_ins')
    .insert({
      entity_type: input.entity_type,
      entity_id: input.entity_id,
      value: input.value,
      confidence: input.confidence,
      comment: input.comment ?? '',
    })
    .select()
    .single();
  if (error) {
    console.error("Error creating check-in:", error);
    throw new Error(error.message);
  }

  if (input.entity_type === 'kr') {
    const { error: krError } = await supabase
      .from('bsc_measures')
      .update({ current_value: input.value })
      .eq('id', input.entity_id);
    if (krError) throw new Error(krError.message);
  } else {
    await upsertKpiMeasurement(input.entity_id, input.value, input.month, input.year);
    const { error: linkedError } = await supabase
      .from('bsc_measures')
      .update({ current_value: input.value })
      .eq('indicator_id', input.entity_id);
    if (linkedError) throw new Error(linkedError.message);
  }

  return data as CheckIn;
}

async function upsertKpiMeasurement(indicatorId: string, value: number, month?: number, year?: number) {
  const now = new Date();
  const m = month ?? now.getMonth() + 1;
  const y = year ?? now.getFullYear();

  const { data: existing, error: findError } = await supabase
    .from('indicator_measurements')
    .select('id')
    .eq('indicator_id', indicatorId)
    .eq('month', m)
    .eq('year', y)
    .maybeSingle();
  if (findError) throw new Error(findError.message);

  const { error } = existing
    ? await supabase.from('indicator_measurements').update({ value }).eq('id', existing.id)
    : await supabase.from('indicator_measurements').insert({ indicator_id: indicatorId, month: m, year: y, value });
  if (error) throw new Error(error.message);
}

export async function getCheckIns(entityType: CheckInEntityType, entityId: string): Promise<CheckIn[]> {
  const { data, error } = await supabase
    .from('check_ins')
    .select('*')
    .eq('entity_type', entityType)
    .eq('entity_id', entityId)
    .order('created_at', { ascending: false });
  if (error) {
    console.error("Error fetching check-ins:", error);
    throw new Error(error.message);
  }
  return (data ?? []) as CheckIn[];
}

/** Último check-in de cada entidade (para confiança e aderência). */
export async function getLatestCheckIns(entityType?: CheckInEntityType): Promise<Map<string, CheckIn>> {
  let query = supabase.from('check_ins').select('*').order('created_at', { ascending: false });
  if (entityType) query = query.eq('entity_type', entityType);
  const { data, error } = await query;
  if (error) {
    console.error("Error fetching latest check-ins:", error);
    throw new Error(error.message);
  }
  const latest = new Map<string, CheckIn>();
  for (const row of (data ?? []) as CheckIn[]) {
    const key = `${row.entity_type}:${row.entity_id}`;
    if (!latest.has(key)) latest.set(key, row);
  }
  return latest;
}

/** Check-in vencido: nenhum registro nos últimos N dias. */
export function isCheckInOverdue(latest: CheckIn | undefined, frequencyDays = 7): boolean {
  if (!latest) return true;
  const ageMs = Date.now() - new Date(latest.created_at).getTime();
  return ageMs > frequencyDays * 24 * 60 * 60 * 1000;
}
