
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
  // Ensure required fields are present
  if (!document.associated_requirement || !document.document_type || !document.title) {
    throw new Error("Missing required fields: associated_requirement, document_type, or title must be provided");
  }
  
  // Create a properly typed object with required fields
  const documentToInsert = {
    associated_requirement: document.associated_requirement,
    document_type: document.document_type,
    title: document.title,
    description: document.description || '',
    content: document.content || '',
    status: document.status || 'draft'
  };
  
  const { data, error } = await supabase
    .from('iso_documents')
    .insert(documentToInsert)
    .select()
    .single();
  
  if (error) {
    console.error("Error creating document template:", error);
    throw error;
  }
  
  return data;
}
