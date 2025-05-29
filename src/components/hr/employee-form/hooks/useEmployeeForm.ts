
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateTrainingsForEmployee } from "@/services/trainingService";
import { useJobPositions } from "@/hooks/useJobPositions";
import { JobPosition } from "../../types";

export function useEmployeeForm(onCancel: () => void) {
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
    dependents: []
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

  return {
    formData,
    setFormData,
    documents,
    setDocuments,
    photoPreview,
    setPhotoPreview,
    selectedJobPosition,
    setSelectedJobPosition,
    isSubmitting,
    handleSubmit,
    jobPositions
  };
}
