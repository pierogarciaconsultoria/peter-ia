import { supabase } from "@/integrations/supabase/client";
import { TablesInsert } from "@/integrations/supabase/types";
import { SwotItem } from "@/types/strategic-planning";

export type SwotItemInput = Omit<TablesInsert<'swot_items'>, 'id' | 'company_id' | 'created_at' | 'updated_at' | 'created_by'>;

export async function getSwotItems(): Promise<SwotItem[]> {
  const { data, error } = await supabase
    .from('swot_items')
    .select('*')
    .order('impact_level', { ascending: false })
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Error fetching SWOT items:", error);
    throw new Error(error.message);
  }
  return (data ?? []) as SwotItem[];
}

export async function createSwotItem(item: SwotItemInput): Promise<SwotItem | null> {
  const { data, error } = await supabase.from('swot_items').insert(item).select().single();
  if (error) {
    console.error("Error creating SWOT item:", error);
    throw new Error(error.message);
  }
  return data as SwotItem;
}

/** Inserção em lote, ignorando descrições já existentes (evita duplicar ao reaplicar a IA). */
export async function createSwotItems(items: SwotItemInput[]): Promise<SwotItem[]> {
  if (items.length === 0) return [];
  const existing = await getSwotItems();
  const known = new Set(existing.map(i => `${i.category}|${i.description.trim().toLowerCase()}`));
  const fresh = items.filter(i => !known.has(`${i.category}|${i.description.trim().toLowerCase()}`));
  if (fresh.length === 0) return [];

  const { data, error } = await supabase.from('swot_items').insert(fresh).select();
  if (error) {
    console.error("Error creating SWOT items:", error);
    throw new Error(error.message);
  }
  return (data ?? []) as SwotItem[];
}

export async function updateSwotItem(id: string, item: Partial<SwotItemInput>): Promise<SwotItem | null> {
  const { data, error } = await supabase.from('swot_items').update(item).eq('id', id).select().single();
  if (error) {
    console.error("Error updating SWOT item:", error);
    throw new Error(error.message);
  }
  return data as SwotItem;
}

export async function deleteSwotItem(id: string): Promise<boolean> {
  const { error } = await supabase.from('swot_items').delete().eq('id', id);
  if (error) {
    console.error("Error deleting SWOT item:", error);
    throw new Error(error.message);
  }
  return true;
}
