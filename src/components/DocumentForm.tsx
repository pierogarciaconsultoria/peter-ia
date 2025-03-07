
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
import { ISODocument } from "@/utils/isoTypes";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { isoRequirements } from "@/utils/isoRequirements";

interface DocumentFormProps {
  document: ISODocument | null;
  onClose: () => void;
}

export function DocumentForm({ document, onClose }: DocumentFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ISODocument>(
    document || {
      id: "",
      title: "",
      document_type: "",
      description: "",
      content: "",
      associated_requirement: "",
      status: "draft",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
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
      
      if (!formData.title || !formData.document_type || !formData.associated_requirement) {
        toast.error("Por favor, preencha todos os campos obrigatórios");
        return;
      }

      const now = new Date().toISOString();
      const dataToSave = {
        ...formData,
        updated_at: now,
      };

      let result;
      
      if (document?.id) {
        // Update existing document
        result = await supabase
          .from('iso_documents')
          .update(dataToSave)
          .eq('id', document.id);
      } else {
        // Create new document
        result = await supabase
          .from('iso_documents')
          .insert([{ ...dataToSave, created_at: now }]);
      }

      const { error } = result;
      
      if (error) throw error;
      
      toast.success(document?.id ? "Documento atualizado com sucesso" : "Documento criado com sucesso");
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

      <div className="grid gap-4 py-4">
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
            Tipo de Documento *
          </Label>
          <Select
            value={formData.document_type}
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
          <Label htmlFor="associated_requirement" className="text-right">
            Requisito ISO *
          </Label>
          <Select
            value={formData.associated_requirement}
            onValueChange={(value) => handleSelectChange("associated_requirement", value)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Selecione o requisito ISO" />
            </SelectTrigger>
            <SelectContent>
              {isoRequirements.map(req => (
                <SelectItem key={req.number} value={req.number}>
                  {req.number} - {req.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-right">
            Status
          </Label>
          <Select
            value={formData.status || 'draft'}
            onValueChange={(value) => handleSelectChange("status", value)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Rascunho</SelectItem>
              <SelectItem value="review">Em Revisão</SelectItem>
              <SelectItem value="approved">Aprovado</SelectItem>
              <SelectItem value="obsolete">Obsoleto</SelectItem>
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
        
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="content" className="text-right">
            Conteúdo
          </Label>
          <Textarea
            id="content"
            name="content"
            value={formData.content || ""}
            onChange={handleInputChange}
            className="col-span-3"
            rows={10}
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
