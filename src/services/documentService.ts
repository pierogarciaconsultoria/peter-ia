
import { supabase } from "@/integrations/supabase/client";
import { ISODocument } from "@/utils/isoTypes";

export async function fetchDocumentsForRequirement(requirementId: string): Promise<ISODocument[]> {
  const { data, error } = await supabase
    .from('iso_documents')
    .select('*')
    .eq('associated_requirement', requirementId);
  
  if (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
  
  return data || [];
}

export async function createDocumentTemplate(document: Partial<ISODocument>): Promise<ISODocument> {
  const { data, error } = await supabase
    .from('iso_documents')
    .insert([document])
    .select()
    .single();
  
  if (error) {
    console.error("Error creating document template:", error);
    throw error;
  }
  
  return data;
}
