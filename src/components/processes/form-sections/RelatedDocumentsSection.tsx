
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Trash2 } from "lucide-react";

interface RelatedDocument {
  id: string;
  title: string;
  document_type: string;
}

interface RelatedDocumentsSectionProps {
  relatedDocuments: RelatedDocument[];
  handleAddDocument: (document: RelatedDocument) => void;
  handleRemoveDocument: (index: number) => void;
  newDocument: RelatedDocument;
  setNewDocument: (document: RelatedDocument) => void;
}

export function RelatedDocumentsSection({
  relatedDocuments,
  handleAddDocument,
  handleRemoveDocument,
  newDocument,
  setNewDocument
}: RelatedDocumentsSectionProps) {
  const [availableDocuments, setAvailableDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>("");

  useEffect(() => {
    fetchAvailableDocuments();
  }, []);

  const fetchAvailableDocuments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('iso_documents')
        .select('id, title, document_type')
        .eq('document_type', 'procedure');
      
      if (error) throw error;
      setAvailableDocuments(data || []);
    } catch (error) {
      console.error("Erro ao buscar documentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentSelect = (docId: string) => {
    setSelectedDocumentId(docId);
    const selectedDoc = availableDocuments.find(doc => doc.id === docId);
    
    if (selectedDoc) {
      setNewDocument({
        id: selectedDoc.id,
        title: selectedDoc.title,
        document_type: selectedDoc.document_type
      });
    }
  };

  const handleAdd = () => {
    if (selectedDocumentId && newDocument) {
      handleAddDocument(newDocument);
      setSelectedDocumentId("");
      setNewDocument({ id: "", title: "", document_type: "" });
    }
  };

  // Filter out documents that are already linked
  const filteredDocuments = availableDocuments.filter(doc => 
    !relatedDocuments.some(relDoc => relDoc.id === doc.id)
  );

  return (
    <Card className="border border-gray-200 rounded-md">
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">Procedimentos Operacionais Relacionados</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-4">
          <div className="md:col-span-3">
            <Label htmlFor="document">Procedimento</Label>
            <Select 
              value={selectedDocumentId} 
              onValueChange={handleDocumentSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um procedimento operacional" />
              </SelectTrigger>
              <SelectContent>
                {filteredDocuments.map(doc => (
                  <SelectItem key={doc.id} value={doc.id}>{doc.title}</SelectItem>
                ))}
                {filteredDocuments.length === 0 && (
                  <SelectItem value="none" disabled>Nenhum procedimento disponível</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleAdd}
            disabled={!selectedDocumentId}
            className="w-full md:w-auto"
          >
            Adicionar
          </Button>
        </div>
        
        {relatedDocuments.length > 0 ? (
          <div className="space-y-2">
            <Label>Procedimentos Vinculados</Label>
            {relatedDocuments.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <span className="font-medium">{doc.title}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({doc.document_type === 'procedure' ? 'Procedimento' : doc.document_type})
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveDocument(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Nenhum procedimento operacional vinculado.</p>
        )}
      </CardContent>
    </Card>
  );
}
