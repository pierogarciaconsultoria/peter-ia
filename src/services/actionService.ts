
import { supabase } from "@/integrations/supabase/client";
import { Action5W2H } from "@/types/actions";

export async function getAllActions(): Promise<Action5W2H[]> {
  const { data, error } = await supabase
    .from('quality_actions')
    .select('*')
    .order('due_date', { ascending: true });
    
  if (error) {
    console.error("Error fetching actions:", error);
    throw error;
  }
  
  return (data as unknown) as Action5W2H[] || [];
}

export async function createAction(action: Omit<Action5W2H, 'id' | 'created_at' | 'updated_at' | 'completed_at'>): Promise<Action5W2H> {
  const { data, error } = await supabase
    .from('quality_actions')
    .insert((action as any))
    .select()
    .single();
    
  if (error) {
    console.error("Error creating action:", error);
    throw error;
  }
  
  return (data as unknown) as Action5W2H;
}

export async function updateAction(id: string, action: Partial<Action5W2H>): Promise<Action5W2H> {
  const { data, error } = await supabase
    .from('quality_actions')
    .update((action as any))
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error("Error updating action:", error);
    throw error;
  }
  
  return (data as unknown) as Action5W2H;
}

export async function deleteAction(id: string): Promise<void> {
  const { error } = await supabase
    .from('quality_actions')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error("Error deleting action:", error);
    throw error;
  }
}
