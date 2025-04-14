
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PersonalInfoTab } from "./employee-form/PersonalInfoTab";
import { DocumentsTab } from "./employee-form/DocumentsTab";
import { JobInfoTab } from "./employee-form/JobInfoTab";
import { AdditionalInfoTab } from "./employee-form/AdditionalInfoTab";
import { FamilyInfoTab } from "./employee-form/FamilyInfoTab";
import { generateTrainingsForEmployee } from "@/services/trainingService";
import { useJobPositions } from "@/hooks/useJobPositions";
import { JobPosition } from "./types";

interface EmployeeFormProps {
  onCancel: () => void;
}

export function EmployeeForm({ onCancel }: EmployeeFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { jobPositions } = useJobPositions();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedJobPosition, setSelectedJobPosition] = useState<JobPosition | null>(null);
  
  // Default form data
  const [formData, setFormData] = useState({
    id: crypto.randomUUID(),
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    whatsapp: "",
    birthDate: null,
    cpf: "",
    documentType: "RG",
    documentId: "",
    address: "",
    department: "",
    position: "",
    hireDate: "",
    salary: "",
    workSchedule: "",
    carteiraDigitalLink: "",
    emergencyContact: "",
    emergencyPhone: "",
    bloodType: "",
    allergies: "",
    disabilities: "",
    spouse: "",
    notes: "",
    dependents: [] // Initialize empty dependents array
  });
  
  // Required documents list
  const [documents, setDocuments] = useState([
    { name: "RG / Documento de Identidade", file: null },
    { name: "CPF", file: null },
    { name: "Comprovante de Residência", file: null },
    { name: "Carteira de Trabalho Digital", file: null },
    { name: "Certificado de Reservista (se aplicável)", file: null },
    { name: "Diploma ou Certificado de Escolaridade", file: null },
    { name: "Certidão de Casamento (se aplicável)", file: null }
  ]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Form validation
      if (!formData.firstName || !formData.lastName || !formData.email) {
        toast({
          title: "Dados incompletos",
          description: "Preencha os campos obrigatórios.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      console.log("Submit form data:", formData);
      
      // Generate trainings if position is selected
      if (formData.position) {
        try {
          const selectedPosition = jobPositions.find(pos => pos.title === formData.position);
          if (selectedPosition) {
            const generatedTrainings = await generateTrainingsForEmployee(
              formData.id,
              selectedPosition.id,
              `${formData.firstName} ${formData.lastName}`,
              formData.department
            );
            
            if (generatedTrainings.length > 0) {
              toast({
                title: "Treinamentos criados",
                description: `${generatedTrainings.length} treinamentos foram gerados para o colaborador com base em seu cargo.`,
              });
            }
          }
        } catch (trainingError) {
          console.error("Error generating trainings:", trainingError);
          toast({
            title: "Atenção",
            description: "Colaborador criado, mas houve um erro ao gerar treinamentos.",
            variant: "default"
          });
        }
      }
      
      toast({
        title: "Colaborador adicionado",
        description: "O novo colaborador foi cadastrado com sucesso.",
      });
      
      onCancel();
    } catch (error) {
      console.error("Error submitting employee:", error);
      toast({
        title: "Erro ao adicionar colaborador",
        description: "Ocorreu um erro ao cadastrar o colaborador. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="job">Dados Profissionais</TabsTrigger>
          <TabsTrigger value="additional">Informações Adicionais</TabsTrigger>
          <TabsTrigger value="family">Dados Familiares</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal" className="pt-4">
          <PersonalInfoTab 
            formData={formData} 
            setFormData={setFormData} 
            photoPreview={photoPreview}
            setPhotoPreview={setPhotoPreview}
          />
        </TabsContent>
        
        <TabsContent value="documents" className="pt-4">
          <DocumentsTab 
            formData={formData} 
            setFormData={setFormData}
            documents={documents}
            setDocuments={setDocuments}
          />
        </TabsContent>
        
        <TabsContent value="job" className="pt-4">
          <JobInfoTab 
            formData={formData} 
            setFormData={setFormData}
            selectedJobPosition={selectedJobPosition}
            setSelectedJobPosition={setSelectedJobPosition}
          />
        </TabsContent>
        
        <TabsContent value="additional" className="pt-4">
          <AdditionalInfoTab 
            formData={formData} 
            setFormData={setFormData} 
          />
        </TabsContent>
        
        <TabsContent value="family" className="pt-4">
          <FamilyInfoTab 
            formData={formData} 
            setFormData={setFormData} 
          />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Salvando..." : "Salvar Colaborador"}
        </Button>
      </div>
    </div>
  );
}
