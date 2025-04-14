
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BasicInfoSection } from "./BasicInfoSection";
import { ResponsibilitiesSection } from "./ResponsibilitiesSection";
import { CompetencySection } from "./CompetencySection";
import { DocumentSelector } from "./DocumentSelector";
import { ResourcesSection } from "./ResourcesSection";
import { useDocumentSelection } from "./useDocumentSelection";
import { JobPosition } from "../../types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface JobPositionFormProps {
  initialData?: JobPosition;
  onSave: (data: JobPosition) => void;
  onCancel: () => void;
}

export function JobPositionForm({ initialData, onSave, onCancel }: JobPositionFormProps) {
  const { documents, isLoading } = useDocumentSelection();
  const [formData, setFormData] = useState<JobPosition>(
    initialData || {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      department: "",
      revision: "1.0",
      is_supervisor: false,
      is_department_head: false,
      status: "draft",
      required_procedures: []
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [field]: checked }));
  };

  const handleSuperiorPositionChange = (value: string) => {
    setFormData(prev => ({ ...prev, superior_position_id: value }));
  };

  const handleDocumentSelection = (documentId: string, documentTitle: string) => {
    setFormData(prev => {
      const currentProcedures = prev.required_procedures || [];
      
      if (currentProcedures.includes(documentId)) {
        return {
          ...prev,
          required_procedures: currentProcedures.filter(id => id !== documentId)
        };
      } else {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.department) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      // In a real application, this would be an API call
      // Here we're just passing the data back to the parent component
      onSave(formData);
    } catch (error) {
      console.error("Error saving job position:", error);
      toast.error("Erro ao salvar descrição de cargo");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <BasicInfoSection 
        formData={formData} 
        onChange={handleChange}
        onCheckboxChange={handleCheckboxChange}
        onSuperiorPositionChange={handleSuperiorPositionChange}
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
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {initialData ? "Atualizar" : "Criar"} Descrição de Cargo
        </Button>
      </div>
    </form>
  );
}
