import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

export type ProcessType = 'Gestão' | 'Negócio' | 'Apoio';
export type ProcessStatus = 'Ativo' | 'Em revisão' | 'Obsoleto';
export type ProcessRow = Omit<Tables<'processes'>, 'process_type' | 'status'> & { process_type: ProcessType; status: ProcessStatus };
export type ProcessInput = Omit<TablesInsert<'processes'>, 'id' | 'company_id' | 'created_at' | 'updated_at'>;

export async function getProcesses(): Promise<ProcessRow[]> {
  const { data, error } = await supabase
    .from('processes')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });
  if (error) {
    console.error("Error fetching processes:", error);
    throw new Error(error.message);
  }
  return (data ?? []) as ProcessRow[];
}

export async function createProcess(input: ProcessInput): Promise<ProcessRow> {
  const { data, error } = await supabase.from('processes').insert(input).select().single();
  if (error) {
    console.error("Error creating process:", error);
    throw new Error(error.message);
  }
  return data as ProcessRow;
}

export async function updateProcess(id: string, input: Partial<ProcessInput>): Promise<ProcessRow> {
  const { data, error } = await supabase.from('processes').update(input).eq('id', id).select().single();
  if (error) {
    console.error("Error updating process:", error);
    throw new Error(error.message);
  }
  return data as ProcessRow;
}

export async function deleteProcess(id: string): Promise<void> {
  const { error } = await supabase.from('processes').delete().eq('id', id);
  if (error) {
    console.error("Error deleting process:", error);
    throw new Error(error.message);
  }
}

const normalize = (s: string) => s.trim().toLowerCase();

/**
 * Cria vários processos ignorando nomes que já existem na empresa.
 * Devolve o mapa nome normalizado -> id, incluindo os já existentes.
 */
export async function ensureProcesses(inputs: ProcessInput[]): Promise<Map<string, string>> {
  const existing = await getProcesses();
  const byName = new Map(existing.map(p => [normalize(p.name), p.id]));
  const fresh = inputs.filter(i => !byName.has(normalize(i.name)));

  if (fresh.length > 0) {
    const { data, error } = await supabase.from('processes').insert(fresh).select('id, name');
    if (error) {
      console.error("Error creating processes:", error);
      throw new Error(error.message);
    }
    for (const row of data ?? []) byName.set(normalize(row.name), row.id);
  }
  return byName;
}
