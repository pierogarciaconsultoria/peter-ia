
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, FileText } from "lucide-react";

interface Document {
  id: string;
  title: string;
  document_code?: string;
  document_type: string;
}

interface RelatedDocumentsSectionProps {
  onDocumentsChange?: (documents: Document[]) => void;
}

export function RelatedDocumentsSection({ onDocumentsChange }: RelatedDocumentsSectionProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([]);

  useEffect(() => {
    async function fetchDocuments() {
      setLoading(true);
      try {
        // Para agora, usar documentos mock até a tabela ser criada
        console.log('Related documents - using mock data until database setup');
        const mockDocuments: Document[] = [
          {
            id: '1',
            title: 'Procedimento de Controle de Qualidade',
            document_code: 'PRC-001',
            document_type: 'Procedimento'
          },
          {
            id: '2',
            title: 'Manual de Operações',
            document_code: 'MAN-001',
            document_type: 'Manual'
          },
          {
            id: '3',
            title: 'Instrução de Trabalho - Soldagem',
            document_code: 'IT-001',
            document_type: 'Instrução'
          }
        ];
        setDocuments(mockDocuments);
      } catch (error) {
        console.error("Error loading documents:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDocuments();
  }, []);

  const handleAddDocument = (documentId: string) => {
    const document = documents.find(doc => doc.id === documentId);
    if (document && !selectedDocuments.find(d => d.id === documentId)) {
      const newSelectedDocuments = [...selectedDocuments, document];
      setSelectedDocuments(newSelectedDocuments);
      onDocumentsChange?.(newSelectedDocuments);
    }
  };

  const handleRemoveDocument = (documentId: string) => {
    const newSelectedDocuments = selectedDocuments.filter(doc => doc.id !== documentId);
    setSelectedDocuments(newSelectedDocuments);
    onDocumentsChange?.(newSelectedDocuments);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documentos Relacionados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentos Relacionados</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="document-select">Adicionar Documento</Label>
          <div className="flex gap-2 mt-1">
            <select
              id="document-select"
              className="flex-1 border border-input bg-background px-3 py-2 text-sm ring-offset-background rounded-md"
              onChange={(e) => {
                if (e.target.value) {
                  handleAddDocument(e.target.value);
                  e.target.value = "";
                }
              }}
            >
              <option value="">Selecionar documento...</option>
              {documents
                .filter(doc => !selectedDocuments.find(d => d.id === doc.id))
                .map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.document_code ? `${doc.document_code} - ` : ''}{doc.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedDocuments.length > 0 && (
          <div className="space-y-2">
            <Label>Documentos Selecionados</Label>
            {selectedDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{doc.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.document_code ? `${doc.document_code} - ` : ''}{doc.document_type}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveDocument(doc.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {selectedDocuments.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhum documento relacionado selecionado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
