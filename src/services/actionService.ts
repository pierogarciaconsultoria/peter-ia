
import { supabase } from "@/integrations/supabase/client";
import { Action5W2H } from "@/types/actions";

export async function getAllActions(): Promise<Action5W2H[]> {
  // Using type assertion to bypass TypeScript's type checking for the table
  const { data, error } = await (supabase
    .from('quality_actions' as any)
    .select('*')
    .order('due_date', { ascending: true }) as any);
    
  if (error) {
    console.error("Error fetching actions:", error);
    throw error;
  }
  
  return (data || []) as Action5W2H[];
}

export async function createAction(action: Omit<Action5W2H, 'id' | 'created_at' | 'updated_at' | 'completed_at'>): Promise<Action5W2H> {
  // Using type assertion to bypass TypeScript's type checking for the table
  const { data, error } = await (supabase
    .from('quality_actions' as any)
    .insert(action)
    .select()
    .single() as any);
    
  if (error) {
    console.error("Error creating action:", error);
    throw error;
  }
  
  return data as Action5W2H;
}

export async function updateAction(id: string, action: Partial<Action5W2H>): Promise<Action5W2H> {
  // Using type assertion to bypass TypeScript's type checking for the table
  const { data, error } = await (supabase
    .from('quality_actions' as any)
    .update(action)
    .eq('id', id)
    .select()
    .single() as any);
    
  if (error) {
    console.error("Error updating action:", error);
    throw error;
  }
  
  return data as Action5W2H;
}

export async function deleteAction(id: string): Promise<void> {
  // Using type assertion to bypass TypeScript's type checking for the table
  const { error } = await (supabase
    .from('quality_actions' as any)
    .delete()
    .eq('id', id) as any);
    
  if (error) {
    console.error("Error deleting action:", error);
    throw error;
  }
}
