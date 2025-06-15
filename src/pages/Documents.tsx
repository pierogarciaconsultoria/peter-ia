
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import { fetchDocuments, createDocument, Document } from "@/services/documentService";
import { DocumentsList } from "@/components/DocumentsList";
import { DocumentForm } from "@/components/DocumentForm";
import { ISODocument } from "@/utils/isoTypes";
import { Plus } from "lucide-react";

// Componente principal
const Documents = () => {
  const [documents, setDocuments] = useState<ISODocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showDialog, setShowDialog] = useState(false);

  // Carregar lista de documentos
  const loadDocuments = async () => {
    setLoading(true);
    try {
      const docs = await fetchDocuments();
      setDocuments(docs);
    } catch (e) {
      toast.error("Erro ao buscar documentos da empresa");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  // Salvar novo documento
  const handleSaveDocument = async (newDoc: Document) => {
    try {
      setLoading(true);
      const doc = await createDocument({
        ...newDoc,
        // Garante campos mínimos necessários
        standard_items: newDoc.standard_items || [],
        company_id: newDoc.company_id || "", // Pode ajustar para pegar empresa logada
      });
      if (doc) {
        toast.success("Documento cadastrado com sucesso!");
        setShowDialog(false);
        await loadDocuments();
      } else {
        toast.error("Erro ao cadastrar documento.");
      }
    } catch {
      toast.error("Erro ao cadastrar documento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-3">Informação Documentada</h1>
      <Card className="max-w-5xl w-full p-7 bg-background">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3">
          <p className="text-muted-foreground max-w-xl text-center sm:text-left mx-auto sm:mx-0">
            Consulte aqui a <b>lista mestra</b> de todos os documentos relacionados à gestão da qualidade na sua empresa.
          </p>
          <Button onClick={() => setShowDialog(true)}>
            <Plus className="mr-2" />
            Novo Documento
          </Button>
        </div>
        <DocumentsList
          documents={documents}
          loading={loading}
          onEditDocument={() => toast("Função de editar documento em breve.")}
        />
      </Card>

      {/* Dialog de novo documento */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl w-full">
          <DocumentForm
            document={null}
            onClose={() => setShowDialog(false)}
            onSave={handleSaveDocument}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Documents;

