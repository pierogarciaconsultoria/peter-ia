
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { JobPosition } from "./types";
import { EmployeeFormData } from "./employee-form/types";

// Import the tab components
import { PersonalInfoTab } from "./employee-form/PersonalInfoTab";
import { JobInfoTab } from "./employee-form/JobInfoTab";
import { DocumentsTab } from "./employee-form/DocumentsTab";
import { FamilyInfoTab } from "./employee-form/FamilyInfoTab";
import { AdditionalInfoTab } from "./employee-form/AdditionalInfoTab";

interface NewEmployeeFormProps {
  onCancel?: () => void;
}

export function NewEmployeeForm({ onCancel }: NewEmployeeFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    birthDate: null as Date | null,
    hireDate: null as Date | null,
    department: "",
    jobTitle: "",
    salary: "",
    emergencyContact: "",
    emergencyPhone: "",
    documentId: "",
    documentType: "RG",
    cpf: "",
    carteiraDigitalLink: "",
    spouse: "",
    dependents: [{ name: "", relationship: "", phone: "", birthDate: null as Date | null }],
    notes: "",
  });
  
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Array<{ name: string; file: File | null }>>([
    { name: "RG", file: null },
    { name: "CPF", file: null },
    { name: "Carteira de Trabalho", file: null },
    { name: "Comprovante de Residência", file: null },
    { name: "Certidão de Nascimento/Casamento", file: null },
  ]);
  const [selectedJobPosition, setSelectedJobPosition] = useState<JobPosition | null>(null);

  // Function to update form data that conforms to EmployeeFormData type
  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Submit logic would go here
    console.log("Form data:", formData);
    console.log("Selected job position:", selectedJobPosition);
    console.log("Documents:", documents);
    
    // Show success toast
    toast({
      title: "Funcionário cadastrado",
      description: "As informações foram salvas com sucesso",
    });
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
          <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="job">Dados do Cargo</TabsTrigger>
          <TabsTrigger value="documents">Documentação</TabsTrigger>
          <TabsTrigger value="family">Informações Familiares</TabsTrigger>
          <TabsTrigger value="additional">Informações Adicionais</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <PersonalInfoTab 
            formData={formData} 
            setFormData={updateFormData} 
            photoPreview={photoPreview}
            setPhotoPreview={setPhotoPreview}
          />
        </TabsContent>

        <TabsContent value="job">
          <JobInfoTab 
            formData={formData} 
            setFormData={updateFormData} 
            selectedJobPosition={selectedJobPosition}
            setSelectedJobPosition={setSelectedJobPosition}
          />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentsTab 
            formData={formData} 
            setFormData={updateFormData} 
            documents={documents}
            setDocuments={setDocuments}
          />
        </TabsContent>

        <TabsContent value="family">
          <FamilyInfoTab 
            formData={formData} 
            setFormData={updateFormData} 
          />
        </TabsContent>

        <TabsContent value="additional">
          <AdditionalInfoTab 
            formData={formData} 
            setFormData={updateFormData} 
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Salvar Funcionário
        </Button>
      </div>
    </form>
  );
}
