import { useToast } from "@/hooks/use-toast";
import { PersonnelRequest, RequestStatus } from "../types";
import { CheckCircle, AlertCircle } from "lucide-react";
import { createNotification } from "@/services/notificationService";
import { supabase } from "@/integrations/supabase/client";
import { movementTypes } from "../form/MovementTypeSelector";

export function useRequestActions(requests: PersonnelRequest[], setRequests: React.Dispatch<React.SetStateAction<PersonnelRequest[]>>) {
  const { toast } = useToast();
  
  const createTaskInModule = async (request: PersonnelRequest) => {
    const movementType = movementTypes.find(type => type.id === request.type);
    if (!movementType) return;

    try {
      console.log(`Creating task in module: ${movementType.targetModule}`);
      console.log({
        title: `${movementType.label} - ${request.employeeName}`,
        description: request.justification,
        module: movementType.targetModule,
        status: 'pending',
        employee_id: request.employee_id,
        requester_id: request.requester_id,
        personnel_request_id: request.id
      });
      
      interface SimulatedTask {
        id: string;
        title: string;
        status: string;
      }

      const simulatedResponseData: SimulatedTask[] = [{
        id: crypto.randomUUID(),
        title: `${movementType.label} - ${request.employeeName}`,
        status: 'pending'
      }];

      const moduleManagers = await getModuleManagers(movementType.targetModule);
      for (const manager of moduleManagers) {
        await createNotification(
          manager.id,
          `Nova tarefa de ${movementType.label}`,
          `Uma nova tarefa foi criada para ${request.employeeName}`,
          "task",
          simulatedResponseData[0].id
        );
      }
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      throw error;
    }
  };

  const getModuleManagers = async (module: string) => {
    const { data } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('role', 'manager')
      .eq('module', module);
    
    return data || [];
  };

  const handleApproval = async (id: string) => {
    try {
      const request = requests.find(req => req.id === id);
      if (!request) throw new Error('Request not found');

      await createTaskInModule(request);
      
      const updatedRequests = requests.map(req => {
        if (req.id === id) {
          return {
            ...req,
            status: "approved" as RequestStatus,
            approved_by: "Gestor",
            approval_date: new Date().toISOString().split('T')[0]
          };
        }
        return req;
      });
      
      setRequests(updatedRequests);
      
      toast({
        title: "Solicitação aprovada",
        description: "A solicitação foi aprovada e as tarefas foram criadas com sucesso.",
        action: (
          <div className="bg-green-50 border border-green-100 px-2 py-1 rounded-md flex items-center gap-2 text-green-700">
            <CheckCircle className="h-4 w-4" />
            <span className="text-xs">Aprovado</span>
          </div>
        )
      });
      
      if (request.employee_id) {
        await createNotification(
          request.employee_id,
          "Solicitação Aprovada",
          `Sua solicitação de ${request.type} foi aprovada.`,
          "personnel_request",
          id
        );
      }
    } catch (error) {
      console.error('Erro ao aprovar solicitação:', error);
      toast({
        title: "Erro ao aprovar solicitação",
        description: "Ocorreu um erro ao processar a aprovação. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleRejection = async (id: string, reason?: string) => {
    const request = requests.find(req => req.id === id);
    
    const updatedRequests = requests.map(req => {
      if (req.id === id) {
        return {
          ...req,
          status: "rejected" as RequestStatus,
          rejection_reason: reason || "Solicitação rejeitada pelo gestor."
        };
      }
      return req;
    });
    
    setRequests(updatedRequests);
    
    toast({
      title: "Solicitação rejeitada",
      description: "A solicitação foi rejeitada.",
      variant: "destructive"
    });
    
    if (request && request.employee_id) {
      try {
        await createNotification(
          request.employee_id,
          "Solicitação Rejeitada",
          `Sua solicitação de ${request.type} foi rejeitada. ${reason ? `Motivo: ${reason}` : ''}`,
          "personnel_request",
          id
        );
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    }
  };

  const handleCancellation = async (id: string, reason?: string) => {
    const request = requests.find(req => req.id === id);
    
    const updatedRequests = requests.map(req => {
      if (req.id === id) {
        return {
          ...req,
          status: "canceled" as RequestStatus,
          rejection_reason: reason || "Solicitação cancelada pelo solicitante."
        };
      }
      return req;
    });
    
    setRequests(updatedRequests);
    
    toast({
      title: "Solicitação cancelada",
      description: "A solicitação foi cancelada.",
      variant: "destructive"
    });
    
    if (request) {
      try {
        const { data: hrManagers } = await supabase
          .from('employees')
          .select('id')
          .eq('department', 'Recursos Humanos')
          .eq('position', 'Gerente');
        
        if (hrManagers && hrManagers.length > 0) {
          for (const manager of hrManagers) {
            await createNotification(
              manager.id,
              "Solicitação Cancelada",
              `Uma solicitação de ${request.type} para ${request.employeeName} foi cancelada.`,
              "personnel_request",
              id
            );
          }
        }
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    }
  };

  return {
    handleApproval,
    handleRejection,
    handleCancellation
  };
}
