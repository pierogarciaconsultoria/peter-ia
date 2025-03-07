
import { useState, useEffect } from "react";
import { ISORequirement } from "@/utils/isoRequirements";
import { ISODocument } from "@/utils/isoTypes";
import { fetchDocumentsForRequirement, createDocumentTemplate } from "@/services/documentService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Plus, Download } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DocumentForm } from "@/components/DocumentForm";
import { useToast } from "@/hooks/use-toast";
import { standardDocuments } from "@/utils/isoTemplates";

interface DocumentTemplatesProps {
  requirement: ISORequirement;
}

export function DocumentTemplates({ requirement }: DocumentTemplatesProps) {
  const [documents, setDocuments] = useState<ISODocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<ISODocument | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function loadDocuments() {
      try {
        setLoading(true);
        const docs = await fetchDocumentsForRequirement(requirement.number);
        setDocuments(docs);
      } catch (error) {
        toast({
          title: "Erro ao carregar documentos",
          description: "Não foi possível carregar os documentos para este requisito.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    loadDocuments();
  }, [requirement.number, toast]);

  const handleCreateTemplate = async () => {
    setSelectedDocument(null);
    setOpenDialog(true);
  };

  const handleEditDocument = (document: ISODocument) => {
    setSelectedDocument(document);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    // Reload documents after dialog is closed
    fetchDocumentsForRequirement(requirement.number)
      .then(docs => setDocuments(docs))
      .catch(error => console.error("Error reloading documents:", error));
  };

  const handleCreateFromTemplate = async (templateId: string) => {
    try {
      // Find the template from standardDocuments
      const template = standardDocuments.find(doc => doc.id === templateId);
      if (!template) return;

      // Create a new document based on the template
      const newDocument: Partial<ISODocument> = {
        title: template.title,
        document_type: template.type,
        description: template.description,
        content: template.template,
        associated_requirement: requirement.number,
        status: 'draft'
      };

      await createDocumentTemplate(newDocument);
      
      toast({
        title: "Documento criado com sucesso",
        description: `${template.title} foi criado com base no modelo.`,
      });

      // Reload documents
      const docs = await fetchDocumentsForRequirement(requirement.number);
      setDocuments(docs);
    } catch (error) {
      toast({
        title: "Erro ao criar documento",
        description: "Não foi possível criar o documento a partir do modelo.",
        variant: "destructive",
      });
    }
  };

  // Filter standard documents that match this requirement
  const availableTemplates = standardDocuments.filter(
    doc => doc.requirementIds.includes(requirement.number)
  );

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Documentos para {requirement.number}</h3>
        <Button onClick={handleCreateTemplate} size="sm">
          <Plus size={16} className="mr-2" />
          Novo Documento
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Carregando documentos...</p>
        </div>
      ) : (
        <>
          {documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {documents.map((doc) => (
                <Card key={doc.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{doc.title}</CardTitle>
                    <CardDescription>
                      Tipo: {doc.document_type} | Status: {doc.status || "Rascunho"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {doc.description || "Sem descrição"}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditDocument(doc)}
                    >
                      Editar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 mb-6 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">
                Nenhum documento criado para este requisito.
              </p>
            </div>
          )}

          {availableTemplates.length > 0 && (
            <>
              <h4 className="text-md font-medium mb-3 mt-6">Modelos Disponíveis</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableTemplates.map((template) => (
                  <Card key={template.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <FileText size={18} className="text-primary" />
                        <CardTitle className="text-md">{template.title}</CardTitle>
                      </div>
                      <CardDescription>
                        Tipo: {template.type}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {template.description}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCreateFromTemplate(template.id)}
                      >
                        <Plus size={16} className="mr-1" />
                        Usar Modelo
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
        </>
      )}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DocumentForm document={selectedDocument} onClose={handleCloseDialog} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
