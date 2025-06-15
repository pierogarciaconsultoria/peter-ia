
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { Document } from "@/services/documentService";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { isoRequirements } from "@/utils/isoRequirements";

interface DocumentFormProps {
  document: Document | null;
  onClose: () => void;
}

export function DocumentForm({ document, onClose }: DocumentFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Document>(
    document || {
      id: "",
      title: "",
      description: "",
      category: "",
      document_type: "",
      version: "",
      file_url: "",
      file_name: "",
      file_size: undefined,
      mime_type: "",
      status: "rascunho",
      tags: [],
      created_by: "",
      approved_by: "",
      approval_date: "",
      review_date: "",
      company_id: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveDocument = async () => {
    try {
      setLoading(true);
      if (!formData.title || !formData.document_type) {
        toast.error("Por favor, preencha todos os campos obrigatórios");
        return;
      }

      toast.success("Documento salvo com sucesso (funcionalidade será ativada após configuração do banco)");
      onClose();
    } catch (error) {
      console.error("Error saving document:", error);
      toast.error("Erro ao salvar o documento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {document?.id ? "Editar Documento" : "Novo Documento"}
        </DialogTitle>
      </DialogHeader>

      <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">
            Título *
          </Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="col-span-3"
            required
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="document_type" className="text-right">
            Categoria *
          </Label>
          <Select
            value={formData.document_type || ""}
            onValueChange={(value) => handleSelectChange("document_type", value)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Selecione o tipo de documento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="policy">Política</SelectItem>
              <SelectItem value="procedure">Procedimento</SelectItem>
              <SelectItem value="work-instruction">Instrução de Trabalho</SelectItem>
              <SelectItem value="form">Formulário</SelectItem>
              <SelectItem value="record">Registro</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-right">
            Status *
          </Label>
          <Select
            value={formData.status || 'rascunho'}
            onValueChange={(value) => handleSelectChange("status", value)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rascunho">Rascunho</SelectItem>
              <SelectItem value="em_revisao">Em Revisão</SelectItem>
              <SelectItem value="aprovado">Aprovado</SelectItem>
              <SelectItem value="obsoleto">Obsoleto</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="description" className="text-right">
            Descrição
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={handleInputChange}
            className="col-span-3"
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="button" onClick={saveDocument} disabled={loading}>
          {loading ? "Salvando..." : document?.id ? "Atualizar" : "Criar"}
        </Button>
      </div>
    </>
  );
}

