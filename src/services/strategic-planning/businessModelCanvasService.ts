import { supabase } from "@/integrations/supabase/client";
import { BusinessModelCanvas, BusinessModelCanvasFields } from "@/types/strategic-planning";

export async function getBusinessModelCanvas(): Promise<BusinessModelCanvas | null> {
  const { data, error } = await supabase
    .from('business_model_canvas')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching business model canvas:", error);
    throw new Error(error.message);
  }
  return data as BusinessModelCanvas | null;
}

/** Cria ou atualiza o canvas da empresa (um por empresa). */
export async function updateBusinessModelCanvas(
  canvas: Partial<BusinessModelCanvasFields> & { source?: 'manual' | 'ai' }
): Promise<BusinessModelCanvas | null> {
  const existing = await getBusinessModelCanvas();
  const payload = { ...canvas, source: canvas.source ?? 'manual' as const };

  const query = existing
    ? supabase.from('business_model_canvas').update(payload).eq('id', existing.id)
    : supabase.from('business_model_canvas').insert(payload);

  const { data, error } = await query.select().single();
  if (error) {
    console.error("Error saving business model canvas:", error);
    throw new Error(error.message);
  }
  return data as BusinessModelCanvas;
}
