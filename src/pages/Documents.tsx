
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { DocumentsList } from "@/components/DocumentsList";
import { DocumentForm } from "@/components/DocumentForm";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, FileDown } from "lucide-react";
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
      toast.error('Falha ao carregar documentos');
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

  const handleExportToExcel = () => {
    // Esta é uma função básica de exportação para CSV
    // Para uma solução mais robusta, considere usar bibliotecas como xlsx ou exceljs
    if (documents.length === 0) {
      toast.error("Não há documentos para exportar");
      return;
    }

    const headers = [
      "Título", "Tipo", "Código", "Processo", "Descrição", "Norma/Item", 
      "Revisão", "Data Aprovação", "Responsável", "Local Distribuição",
      "Armazenamento", "Proteção", "Recuperação", "Tempo Retenção",
      "Tempo Arquivo", "Descarte", "Status"
    ];

    const csvContent = documents.map(doc => {
      return [
        doc.title,
        doc.internal_external === 'interno' ? 'Interno' : 'Externo',
        doc.document_code || "",
        doc.process || "",
        doc.description || "",
        doc.standard_item || "",
        doc.revision || "",
        doc.approval_date ? new Date(doc.approval_date).toLocaleDateString('pt-BR') : "",
        doc.responsible || "",
        doc.distribution_location || "",
        doc.storage_location || "",
        doc.protection || "",
        doc.recovery_method || "",
        doc.retention_time || "",
        doc.archiving_time || "",
        doc.disposal_method || "",
        doc.status || ""
      ].map(cell => `"${cell.toString().replace(/"/g, '""')}"`).join(',');
    });

    const csv = [
      headers.join(','),
      ...csvContent
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'lista_mestra_documentos.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="md:pl-64 p-6 transition-all duration-300 flex-1">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Lista Mestra de Documentos ISO 9001</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportToExcel}>
                <FileDown size={18} className="mr-2" />
                Exportar
              </Button>
              <Button onClick={handleAddDocument}>
                <Plus size={18} className="mr-2" />
                Novo Documento
              </Button>
            </div>
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
      
      <Footer />
    </div>
  );
};

export default Documents;
