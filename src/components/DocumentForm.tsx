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
import { MultiSelect } from "@/components/ui/multi-select";

const documentTypes = [
  { value: "policy", label: "Política" },
  { value: "procedure", label: "Procedimento" },
  { value: "work-instruction", label: "Instrução de Trabalho" },
  { value: "form", label: "Formulário" },
  { value: "record", label: "Registro" },
  { value: "manual", label: "Manual" }
];

const statusOptions = [
  { value: "rascunho", label: "Rascunho" },
  { value: "em_revisao", label: "Em Revisão" },
  { value: "aprovado", label: "Aprovado" },
  { value: "obsoleto", label: "Obsoleto" }
];

const internalExternalOpts = [
  { value: "interno", label: "Interno" },
  { value: "externo", label: "Externo" }
];

interface DocumentFormProps {
  document: Document | null;
  onClose: () => void;
  onSave?: (doc: Document) => void; // Para integração futura
}

export function DocumentForm({ document, onClose, onSave }: DocumentFormProps) {
  const [loading, setLoading] = useState(false);
  // Fix: ensure default for associated_requirement and standard_items ALWAYS as array
  const [formData, setFormData] = useState<Document>(
    document || {
      id: "",
      title: "",
      document_code: "",
      document_type: "",
      description: "",
      revision: "",
      approval_date: "",
      standard_items: [], // Properly default to empty array
      process: "",
      distribution_location: "",
      storage_location: "",
      protection: "",
      recovery_method: "",
      retention_time: "",
      archiving_time: "",
      disposal_method: "",
      status: "rascunho",
      internal_external: "interno",
      created_by: "",
      approved_by: "",
      company_id: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      associated_requirement: "", // Required field per ISODocument
    }
  );

  // Handler internals
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  type Option = { value: string; label: string };
  const isoOptions: Option[] = isoRequirements.map(req => ({
    value: req.number, label: req.number + " - " + req.title
  }));

  // PROTEÇÃO AQUI ↓↓↓↓↓
  // Garante que o filtro só tenta `.includes` se for array, nunca null/undefined
  const standardItemsValue: Option[] =
    Array.isArray(formData.standard_items)
      ? isoOptions.filter(opt => formData.standard_items.includes(opt.value))
      : [];

  const handleMultiSelectChange = (selected: Option[]) => {
    setFormData((prev) => ({
      ...prev,
      standard_items: Array.isArray(selected) ? selected.map(s => s.value) : [],
    }));
  };

  const saveDocument = async () => {
    try {
      setLoading(true);
      if (!formData.title || !formData.document_type) {
        toast.error("Por favor, preencha todos os campos obrigatórios");
        return;
      }
      // Aqui deve-se chamar o service para salvar (para uso futuro)
      toast.success("Documento salvo com sucesso (simulação)");
      if (typeof onClose === "function") onClose();
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
          <Label htmlFor="revision" className="text-right">
            Revisão
          </Label>
          <Input
            id="revision"
            name="revision"
            value={formData.revision || ""}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="approval_date" className="text-right">
            Data de Aprovação
          </Label>
          <Input
            id="approval_date"
            name="approval_date"
            type="date"
            value={formData.approval_date ? formData.approval_date.substring(0,10) : ""}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="standard_items" className="text-right">
            Itens Norma ISO 9001:2015
          </Label>
          <MultiSelect
            options={isoOptions}
            value={standardItemsValue}
            onChange={handleMultiSelectChange}
            className="col-span-3"
            placeholder="Selecione os itens da norma"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="process" className="text-right">
            Processo Relacionado
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
            Local de Armazenamento
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
            Recuperação
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

        {/* Elaborado por/Aprovador poderiam ser selects futuramente */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="created_by" className="text-right">
            Elaborado por
          </Label>
          <Input
            id="created_by"
            name="created_by"
            value={formData.created_by || ""}
            onChange={handleInputChange}
            className="col-span-3"
            placeholder="ID do usuário elaborador"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="approved_by" className="text-right">
            Aprovado por
          </Label>
          <Input
            id="approved_by"
            name="approved_by"
            value={formData.approved_by || ""}
            onChange={handleInputChange}
            className="col-span-3"
            placeholder="ID do usuário aprovador"
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
              {documentTypes.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
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
              {statusOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="internal_external" className="text-right">
            Doc. Interno/Externo
          </Label>
          <Select
            value={formData.internal_external || "interno"}
            onValueChange={(value) => handleSelectChange("internal_external", value)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Tipo do documento" />
            </SelectTrigger>
            <SelectContent>
              {internalExternalOpts.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
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
