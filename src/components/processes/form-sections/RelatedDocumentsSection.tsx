
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";

export interface RelatedDocument {
  id: string;
  title: string;
  document_type: string;
}

export interface RelatedDocumentsSectionProps {
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
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Documentos Relacionados</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Título do Documento</label>
          <Input
            value={newDocument.title}
            onChange={(e) => setNewDocument({
              ...newDocument,
              title: e.target.value
            })}
            placeholder="Ex: Manual de Procedimentos"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Tipo de Documento</label>
          <Select
            value={newDocument.document_type}
            onValueChange={(value) => setNewDocument({
              ...newDocument,
              document_type: value
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="procedure">Procedimento</SelectItem>
              <SelectItem value="policy">Política</SelectItem>
              <SelectItem value="instruction">Instrução de Trabalho</SelectItem>
              <SelectItem value="form">Formulário</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button 
        type="button" 
        onClick={() => handleAddDocument(newDocument)}
        disabled={!newDocument.title || !newDocument.document_type}
      >
        Adicionar Documento
      </Button>
      
      {relatedDocuments.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Documentos Adicionados:</h4>
          {relatedDocuments.map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded">
              <span>{doc.title} ({doc.document_type})</span>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveDocument(index)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
