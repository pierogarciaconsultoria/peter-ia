
import { supabase } from "@/integrations/supabase/client";

export interface Occurrence {
  id: string;
  employee_id: string;
  type: 'warning' | 'disciplinary' | 'observation';
  title: string;
  description: string;
  date: string;
  reported_by: string;
  status: 'pending' | 'in_progress' | 'resolved';
  created_at?: string;
  updated_at?: string;
}

export interface OccurrenceWithEmployee extends Occurrence {
  employee: {
    id: string;
    name: string;
    position: string;
    department: string;
    avatar_url: string | null;
  };
}

export async function getOccurrences(): Promise<OccurrenceWithEmployee[]> {
  try {
    const { data, error } = await supabase
      .from('occurrences')
      .select(`
        *,
        employee:employee_id(id, name, position, department, avatar_url)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data as OccurrenceWithEmployee[] || [];
  } catch (error) {
    console.error("Error fetching occurrences:", error);
    throw error;
  }
}

export async function createOccurrence(occurrence: Omit<Occurrence, 'id' | 'created_at' | 'updated_at'>): Promise<Occurrence> {
  try {
    const { data, error } = await supabase
      .from('occurrences')
      .insert([occurrence])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Occurrence;
  } catch (error) {
    console.error("Error creating occurrence:", error);
    throw error;
  }
}

export async function updateOccurrence(id: string, occurrence: Partial<Omit<Occurrence, 'id' | 'created_at' | 'updated_at'>>): Promise<Occurrence> {
  try {
    const { data, error } = await supabase
      .from('occurrences')
      .update(occurrence)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Occurrence;
  } catch (error) {
    console.error("Error updating occurrence:", error);
    throw error;
  }
}

export async function deleteOccurrence(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('occurrences')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error deleting occurrence:", error);
    throw error;
  }
}
