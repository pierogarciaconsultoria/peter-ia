
import { useState } from "react";
import { RequestFormValues, PersonnelRequest } from "./types";
import { useToast } from "@/components/ui/use-toast";
import { AlertTriangle } from "lucide-react";

interface PersonnelRequestHandlerProps {
  onAddRequest: () => void;
  requests: PersonnelRequest[];
  setRequests: React.Dispatch<React.SetStateAction<PersonnelRequest[]>>;
  employees: any[];
  jobPositions: any[];
}

export function PersonnelRequestHandler({ 
  onAddRequest, 
  requests, 
  setRequests, 
  employees, 
  jobPositions 
}: PersonnelRequestHandlerProps) {
  const { toast } = useToast();
  
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
    
    // Find requester info
    const requester = employees.find(emp => emp.id === data.requester_id);
    
    // Find manager (superior) of the requester - in a real app this would be fetched from the database
    // For now, we'll simulate by assuming each department has a head
    let managerId = undefined;
    let managerName = "";
    
    if (requester) {
      // Simulate finding the manager based on department
      // In a real app, you'd look up the org chart
      for (const emp of employees) {
        if (emp.department === requester.department && emp.is_department_head) {
          managerId = emp.id;
          managerName = emp.name;
          break;
        }
      }
    }
    
    // In a real implementation, this would send the data to an API
    const newRequest: PersonnelRequest = {
      id: (requests.length + 1).toString(),
      type: getTypeLabel(data.type),
      department: data.department,
      position: data.currentPosition || (selectedPosition ? selectedPosition.title : ""),
      position_id: data.position_id,
      requestDate: data.requestDate || new Date().toISOString().split('T')[0],
      status: "manager_approval", // New status to indicate manager needs to approve
      requester: requester ? requester.name : "Usuário Atual",
      requester_id: data.requester_id,
      manager_id: managerId,
      employeeName: data.employeeName,
      currentSalary: data.currentSalary,
      proposedSalary: data.proposedSalary,
      justification: data.justification,
      hr_observation: "",
      rejection_reason: ""
    };
    
    setRequests([newRequest, ...requests]);
    
    toast({
      title: "Solicitação enviada",
      description: "Sua solicitação de movimentação foi enviada para aprovação do gestor.",
      action: (
        <div className="bg-amber-50 border border-amber-100 px-2 py-1 rounded-md flex items-center gap-2 text-amber-700">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-xs">Aguardando aprovação</span>
        </div>
      )
    });
  };
  
  return { handleSubmit };
}
