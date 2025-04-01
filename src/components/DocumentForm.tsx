
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
          <Label htmlFor="document_code" className="text-right">
            Código
          </Label>
          <Input
            id="document_code"
            name="document_code"
            value={formData.document_code || ""}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="internal_external" className="text-right">
            Tipo
          </Label>
          <Select
            value={formData.internal_external || "interno"}
            onValueChange={(value) => handleSelectChange("internal_external", value)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="interno">Interno</SelectItem>
              <SelectItem value="externo">Externo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="document_type" className="text-right">
            Categoria *
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
          <Label htmlFor="process" className="text-right">
            Processo
          </Label>
          <Input
            id="process"
            name="process"
            value={formData.process || ""}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="standard_item" className="text-right">
            Norma / Item
          </Label>
          <Input
            id="standard_item"
            name="standard_item"
            value={formData.standard_item || ""}
            onChange={handleInputChange}
            className="col-span-3"
          />
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
          <Label htmlFor="revision" className="text-right">
            Revisão
          </Label>
          <Input
            id="revision"
            name="revision"
            value={formData.revision || "00"}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="approval_date" className="text-right">
            Data de Aprovação
          </Label>
          <div className="col-span-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.approval_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.approval_date ? format(new Date(formData.approval_date), "dd/MM/yyyy") : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.approval_date ? new Date(formData.approval_date) : undefined}
                  onSelect={(date) => handleDateChange(date, "approval_date")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="responsible" className="text-right">
            Responsável
          </Label>
          <Input
            id="responsible"
            name="responsible"
            value={formData.responsible || ""}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="distribution_location" className="text-right">
            Local de Distribuição
          </Label>
          <Input
            id="distribution_location"
            name="distribution_location"
            value={formData.distribution_location || ""}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="storage_location" className="text-right">
            Armazenamento
          </Label>
          <Input
            id="storage_location"
            name="storage_location"
            value={formData.storage_location || ""}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="protection" className="text-right">
            Proteção
          </Label>
          <Input
            id="protection"
            name="protection"
            value={formData.protection || ""}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="recovery_method" className="text-right">
            Método de Recuperação
          </Label>
          <Input
            id="recovery_method"
            name="recovery_method"
            value={formData.recovery_method || ""}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="retention_time" className="text-right">
            Tempo de Retenção
          </Label>
          <Input
            id="retention_time"
            name="retention_time"
            value={formData.retention_time || ""}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="archiving_time" className="text-right">
            Tempo de Arquivo
          </Label>
          <Input
            id="archiving_time"
            name="archiving_time"
            value={formData.archiving_time || ""}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="disposal_method" className="text-right">
            Forma de Descarte
          </Label>
          <Input
            id="disposal_method"
            name="disposal_method"
            value={formData.disposal_method || ""}
            onChange={handleInputChange}
            className="col-span-3"
          />
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
