
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { JobPosition } from "./types";
import { PersonnelRequest, RequestFormValues } from "./personnel/types";
import { RequestFormDialog } from "./personnel/RequestFormDialog";
import { RequestHeader } from "./personnel/RequestHeader";
import { RequestStatusCards } from "./personnel/RequestStatusCards";
import { RequestTable } from "./personnel/RequestTable";
import { mockRequests } from "./personnel/mock-data";

export function PersonnelMovement() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [requests, setRequests] = useState<PersonnelRequest[]>([]);
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch job positions from Supabase
  useEffect(() => {
    const fetchJobPositions = async () => {
      try {
        const { data, error } = await supabase
          .from('job_positions')
          .select('*');
        
        if (error) {
          console.error('Error fetching job positions:', error);
          toast({
            title: "Erro ao carregar cargos",
            description: "Não foi possível carregar a lista de cargos.",
            variant: "destructive",
          });
          return;
        }
        
        if (data) {
          // Add required fields to match JobPosition type
          const formattedPositions: JobPosition[] = data.map((pos: any) => ({
            id: pos.id,
            title: pos.title,
            department: pos.department,
            description: pos.description,
            code: pos.code || '',
            revision: pos.revision || '1.0',
            is_supervisor: pos.is_supervisor || false,
            is_department_head: pos.is_department_head || false,
            superior_position_id: pos.superior_position_id,
            status: (pos.status as "draft" | "approved" | "in_review" | "distributed") || "approved",
            approval_date: pos.approval_date,
            approver: pos.approver,
            immediate_supervisor_position: pos.immediate_supervisor_position,
            cbo_code: pos.cbo_code,
            norm: pos.norm,
            main_responsibilities: pos.main_responsibilities,
            education_requirements: pos.education_requirements,
            skill_requirements: pos.skill_requirements,
            training_requirements: pos.training_requirements,
            experience_requirements: pos.experience_requirements,
            required_procedures: pos.required_procedures,
            required_resources: pos.required_resources,
            required_ppe: pos.required_ppe,
          }));
          setJobPositions(formattedPositions);
        }
      } catch (error) {
        console.error('Error in job positions fetch:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobPositions();
    
    // For demo purposes, we'll continue using the mock requests
    setRequests(mockRequests);
  }, [toast]);
  
  const handleSubmit = (data: RequestFormValues) => {
    // Map form movement type to a readable label
    const getTypeLabel = (type: string) => {
      const typeMap: { [key: string]: string } = {
        "hiring": "Admissão",
        "termination": "Demissão",
        "salaryChange": "Aumento salarial",
        "positionChange": "Mudança de cargo",
        "vacation": "Férias",
        "scheduleChange": "Mudança de horário",
        "absence": "Falta ao trabalho",
        "late": "Chegou atrasado",
        "medicalCertificate": "Atestado",
        "cardPunchForgot": "Esqueceu de bater cartão",
        "departmentChange": "Mudança de setor",
        "shiftChange": "Troca de turno",
        "factoryLeave": "Autorização saída da fábrica",
        "writtenWarning": "Advertência por escrito",
        "verbalWarning": "Advertência verbal",
        "overtimeAuth": "Autorizado a fazer hora extra",
        "dayExchange": "Troca de dia",
        "hourCredit": "Abono de hora"
      };
      return typeMap[type] || type;
    };
    
    // Find the selected job position to get its details
    const selectedPosition = jobPositions.find(job => job.id === data.position_id);
    
    // In a real implementation, this would send the data to an API
    const newRequest: PersonnelRequest = {
      id: (requests.length + 1).toString(),
      type: getTypeLabel(data.type),
      department: data.department,
      position: data.currentPosition || (selectedPosition ? selectedPosition.title : ""),
      position_id: data.position_id,
      requestDate: new Date().toISOString().split('T')[0],
      status: "pending",
      requester: "Usuário Atual", // In a real app, this would be the logged-in user
      employeeName: data.employeeName,
      currentSalary: data.currentSalary,
      proposedSalary: data.proposedSalary,
      justification: data.justification
    };
    
    setRequests([newRequest, ...requests]);
    setIsDialogOpen(false);
    
    toast({
      title: "Solicitação enviada",
      description: "Sua solicitação de movimentação foi registrada com sucesso.",
    });
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate refresh - in a real app this would fetch fresh data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <div className="space-y-6">
      <RequestHeader 
        onAddRequest={() => setIsDialogOpen(true)}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />
      
      <RequestStatusCards requests={requests} />
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Solicitações Recentes</CardTitle>
          <CardDescription>
            Gerenciamento de requisições para o setor de Recursos Humanos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RequestTable requests={requests} />
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Exportar Relatório
          </Button>
        </CardFooter>
      </Card>
      
      {/* New Request Dialog */}
      <RequestFormDialog 
        isOpen={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        onSubmit={handleSubmit}
        jobPositions={jobPositions}
      />
    </div>
  );
}
