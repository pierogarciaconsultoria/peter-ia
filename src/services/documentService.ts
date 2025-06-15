
import { supabase } from "@/integrations/supabase/client";

export type Document = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  document_type?: string;
  version?: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  mime_type?: string;
  status: "rascunho" | "em_revisao" | "aprovado" | "obsoleto";
  tags?: string[];
  created_by?: string;
  approved_by?: string;
  approval_date?: string;
  review_date?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
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
  return data as Document[];
}

// Criar novo documento (sem upload por enquanto)
export async function createDocument(document: Omit<Document, "id" | "created_at" | "updated_at">): Promise<Document | null> {
  const { data, error } = await supabase
    .from("documents")
    .insert([document])
    .select()
    .single();
  if (error) {
    console.error("Erro ao criar documento:", error);
    return null;
  }
  return data as Document;
}
