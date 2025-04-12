
import React, { useState } from "react";
import { ProcessMappingFormProps } from "./ProcessMappingFormTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function ProcessMappingForm({ onSuccess, initialData }: ProcessMappingFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    type: initialData?.type || "main",
    owner: initialData?.owner || "",
    department: initialData?.department || "",
    inputs: initialData?.inputs || "",
    outputs: initialData?.outputs || "",
    resources: initialData?.resources || "",
    indicators: initialData?.indicators || "",
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.type) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }
    
    try {
      setLoading(true);
      
      // Here you would typically save the data to your database
      // For now, let's just simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(initialData ? "Processo atualizado com sucesso" : "Processo criado com sucesso");
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving process:", error);
      toast.error("Erro ao salvar o processo");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <DialogHeader>
        <DialogTitle>{initialData ? "Editar Processo" : "Novo Processo"}</DialogTitle>
        <DialogDescription>
          {initialData ? "Altere as informações do processo conforme necessário." : "Preencha as informações para cadastrar um novo processo."}
        </DialogDescription>
      </DialogHeader>
      
      <ScrollArea className="max-h-[60vh] pr-4">
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Nome do Processo *
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Tipo *
            </Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => handleSelectChange("type", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione o tipo de processo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main">Processo Principal</SelectItem>
                <SelectItem value="support">Processo de Apoio</SelectItem>
                <SelectItem value="management">Processo de Gestão</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="owner" className="text-right">
              Responsável
            </Label>
            <Input
              id="owner"
              name="owner"
              value={formData.owner}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">
              Departamento
            </Label>
            <Input
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">
              Descrição
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="col-span-3"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="inputs" className="text-right pt-2">
              Entradas
            </Label>
            <Textarea
              id="inputs"
              name="inputs"
              value={formData.inputs}
              onChange={handleChange}
              className="col-span-3"
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="outputs" className="text-right pt-2">
              Saídas
            </Label>
            <Textarea
              id="outputs"
              name="outputs"
              value={formData.outputs}
              onChange={handleChange}
              className="col-span-3"
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="resources" className="text-right pt-2">
              Recursos
            </Label>
            <Textarea
              id="resources"
              name="resources"
              value={formData.resources}
              onChange={handleChange}
              className="col-span-3"
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="indicators" className="text-right pt-2">
              Indicadores
            </Label>
            <Textarea
              id="indicators"
              name="indicators"
              value={formData.indicators}
              onChange={handleChange}
              className="col-span-3"
              rows={2}
            />
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : initialData ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </ScrollArea>
    </>
  );
}
