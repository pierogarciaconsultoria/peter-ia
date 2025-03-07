
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { DocumentsList } from "@/components/DocumentsList";
import { DocumentForm } from "@/components/DocumentForm";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { ISODocument } from "@/utils/isoTypes";

const Documents = () => {
  const [documents, setDocuments] = useState<ISODocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<ISODocument | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('iso_documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDocument = () => {
    setSelectedDocument(null);
    setIsFormOpen(true);
  };

  const handleEditDocument = (document: ISODocument) => {
    setSelectedDocument(document);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    fetchDocuments();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="md:pl-64 p-6 transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Documentos ISO 9001</h1>
            <Button onClick={handleAddDocument}>
              <Plus size={18} className="mr-2" />
              Novo Documento
            </Button>
          </div>
          
          <DocumentsList 
            documents={documents} 
            loading={loading} 
            onEditDocument={handleEditDocument}
          />
        </div>
      </main>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DocumentForm 
            document={selectedDocument} 
            onClose={handleFormClose} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Documents;
