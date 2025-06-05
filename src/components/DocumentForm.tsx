
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
import { ISODocument } from "@/services/documentService";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { isoRequirements } from "@/utils/isoRequirements";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

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
      updated_at: new Date().toISOString(),
      document_code: "",
      process: "",
      standard_item: "",
      revision: "00",
      approval_date: undefined,
      responsible: "",
      distribution_location: "",
      storage_location: "",
      protection: "",
      recovery_method: "",
      retention_time: "",
      archiving_time: "",
      disposal_method: "",
      internal_external: "interno"
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined, fieldName: string) => {
    if (date) {
      setFormData((prev) => ({ 
        ...prev, 
        [fieldName]: date.toISOString().split('T')[0] 
      }));
    }
  };

  const saveDocument = async () => {
    try {
      setLoading(true);
      
      if (!formData.title || !formData.document_type || !formData.associated_requirement) {
        toast.error("Por favor, preencha todos os campos obrigatórios");
        return;
      }

      // For now, just show success message since table doesn't exist yet
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
            value={formData.document_type || "policy"}
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
            value={formData.associated_requirement || "4.1"}
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
