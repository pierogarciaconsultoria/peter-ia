import { useState, useEffect } from "react";
import { ISORequirement } from "@/utils/isoRequirements";
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

// Patch types for code using ISODocument & non-existing functions (fallback for build)
// Replace ISODocument usage with any, or define a local type if needed for the preview to work
type LocalDocument = {
  id: string;
  title: string;
  description?: string;
  document_type?: string;
  content?: string;
  associated_requirement?: string;
  status?: string;
};

export function DocumentTemplates({ requirement }: DocumentTemplatesProps) {
  // Replace with local/fake data for now
  const [documents, setDocuments] = useState<LocalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<LocalDocument | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(false);
    // TODO: Implement fetching when backend ready
    setDocuments([]);
  }, [requirement.number]);

  const handleCreateTemplate = async () => {
    setSelectedDocument(null);
    setOpenDialog(true);
  };

  const handleEditDocument = (document: LocalDocument) => {
    setSelectedDocument(document);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    // TODO: Fetch/reload documents after dialog is closed when backend is implemented
  };

  const handleCreateFromTemplate = async (templateId: string) => {
    toast({
      title: "Funcionalidade não implementada",
      description: "Criação de documento por modelo estará disponível em breve.",
      variant: "destructive"
    });
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
          <DocumentForm document={selectedDocument as any} onClose={handleCloseDialog} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
