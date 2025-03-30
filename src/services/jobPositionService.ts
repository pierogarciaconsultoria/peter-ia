
import { supabase } from "@/integrations/supabase/client";
import { ISODocument } from "@/utils/isoTypes";

export async function fetchDocumentsForSelection(): Promise<ISODocument[]> {
  const { data, error } = await supabase
    .from('iso_documents')
    .select('*')
    .order('title');
  
  if (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
  
  return data || [];
}
