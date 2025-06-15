import { supabase } from "@/integrations/supabase/client";
import { ISODocument } from "@/utils/isoTypes";

export type Document = ISODocument & {
  file_url?: string;
  file_name?: string;
  file_size?: number;
  mime_type?: string;
  company_id: string;
};

// Buscar todos documentos da empresa logada
export async function fetchDocuments(): Promise<Document[]> {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Erro ao buscar documentos:", error);
    return [];
  }
  // Fix: Ensure associated_requirement present in all objects
  return (data as any[]).map(doc => ({
    associated_requirement: "",
    ...doc
  })) as Document[];
}

// Criar novo documento (sem upload por enquanto)
export async function createDocument(
  document: Omit<Document, "id" | "created_at" | "updated_at">
): Promise<Document | null> {
  const { data, error } = await supabase
    .from("documents")
    .insert([document])
    .select()
    .single();
  if (error) {
    console.error("Erro ao criar documento:", error);
    return null;
  }
  // Ensure required field present for typing
  return { associated_requirement: "", ...data } as Document;
}

export async function updateDocument(id: string, fields: Partial<Document>): Promise<Document | null> {
  const { data, error } = await supabase
    .from("documents")
    .update(fields)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    console.error("Erro ao atualizar documento:", error);
    return null;
  }
  return { associated_requirement: "", ...data } as Document;
}
