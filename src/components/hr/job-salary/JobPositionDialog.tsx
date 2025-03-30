
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { JobPosition } from "../types";
import { useToast } from "@/hooks/use-toast";
import { BasicInfoSection } from "./job-position-form/BasicInfoSection";
import { ResponsibilitiesSection } from "./job-position-form/ResponsibilitiesSection";
import { CompetencySection } from "./job-position-form/CompetencySection";
import { DocumentSelector } from "./job-position-form/DocumentSelector";
import { ResourcesSection } from "./job-position-form/ResourcesSection";
import { useDocumentSelection } from "./job-position-form/useDocumentSelection";

interface JobPositionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (jobPosition: JobPosition) => void;
  jobPosition?: JobPosition;
}

export function JobPositionDialog({
  isOpen,
  onClose,
  onSave,
  jobPosition,
}: JobPositionDialogProps) {
  const { toast } = useToast();
  const isEditing = !!jobPosition;
  const { documents, isLoading } = useDocumentSelection();
  
  const [formData, setFormData] = useState<JobPosition>(
    jobPosition || {
      id: crypto.randomUUID(),
      code: "",
      title: "",
      description: "",
      department: "",
      revision: "1.0",
      is_supervisor: false,
      status: "draft",
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_supervisor: checked }));
  };

  const handleDocumentSelection = (documentId: string, documentTitle: string) => {
    setFormData((prev) => {
      const currentProcedures = prev.required_procedures || [];
      
      // Check if document is already selected
      if (currentProcedures.includes(documentId)) {
        // Remove document from selection
        return {
          ...prev,
          required_procedures: currentProcedures.filter(id => id !== documentId)
        };
      } else {
        // Add document to selection
        return {
          ...prev,
          required_procedures: [...currentProcedures, documentId]
        };
      }
    });
  };

  const removeSelectedDocument = (docId: string) => {
    setFormData(prev => ({
      ...prev,
      required_procedures: (prev.required_procedures || []).filter(id => id !== docId)
    }));
  };

  const handleTextareaArrayChange = (field: keyof JobPosition, values: string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: values
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.title) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Descrição de Cargo" : "Nova Descrição de Cargo"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <BasicInfoSection 
            formData={formData} 
            onChange={handleChange}
            onCheckboxChange={handleCheckboxChange}
          />
          
          <ResponsibilitiesSection 
            formData={formData}
            onChange={handleChange}
          />
          
          <CompetencySection 
            formData={formData}
            onChange={handleChange}
          />
          
          <DocumentSelector
            documents={documents}
            selectedDocuments={formData.required_procedures || []}
            onSelectionChange={handleDocumentSelection}
            onRemove={removeSelectedDocument}
            isLoading={isLoading}
          />
          
          <ResourcesSection 
            formData={formData}
            onTextareaChange={handleTextareaArrayChange}
          />
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
