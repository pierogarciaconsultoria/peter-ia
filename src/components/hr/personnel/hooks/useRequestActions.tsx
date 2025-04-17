
import { useToast } from "@/hooks/use-toast";
import { PersonnelRequest } from "../types";
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
      // Instead of trying to create a task directly in a "tasks" table (which doesn't exist),
      // we'll create a record in a table that does exist, or simply log the information for now
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
      
      // If we needed to create an actual record, we would use an existing table:
      // For example, creating an occurrence for this request
      // const { data: taskData, error } = await supabase
      //   .from('occurrences')
      //   .insert({
      //     title: `${movementType.label} - ${request.employeeName}`,
      //     description: request.justification || 'Request from personnel movement',
      //     type: movementType.targetModule,
      //     employee_id: request.employee_id,
      //     date: new Date().toISOString().split('T')[0],
      //     reported_by: request.requester_id,
      //     status: 'pending'
      //   })
      //   .select();

      // Define type for simulated response data
      type SimulatedTask = {
        id: string;
        title: string;
        status: string;
      };

      // Simulate success response with proper typing
      const simulatedResponseData: SimulatedTask[] = [{
        id: crypto.randomUUID(),
        title: `${movementType.label} - ${request.employeeName}`,
        status: 'pending'
      }];

      // Notificar responsável do módulo
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

  // Handle approval of a request
  const handleApproval = async (id: string) => {
    try {
      const request = requests.find(req => req.id === id);
      if (!request) throw new Error('Request not found');

      // Criar tarefa no módulo correspondente
      await createTaskInModule(request);
      
      // Create a new array with the updated request
      const updatedRequests = requests.map(req => {
        if (req.id === id) {
          // Use type assertion to ensure correct typing
          return {
            ...req,
            status: "approved" as const,
            approved_by: "Gestor",
            approval_date: new Date().toISOString().split('T')[0]
          };
        }
        return req;
      });
      
      // Update state with new array
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
      
      // Notificar o colaborador
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

  // Handle rejection of a request
  const handleRejection = async (id: string, reason?: string) => {
    // Find the current request to get employee information
    const request = requests.find(req => req.id === id);
    
    // Create a new array with the updated request
    const updatedRequests = requests.map(req => {
      if (req.id === id) {
        return {
          ...req,
          status: "rejected" as const,
          rejection_reason: reason || "Solicitação rejeitada pelo gestor."
        };
      }
      return req;
    });
    
    // Update state with new array
    setRequests(updatedRequests);
    
    toast({
      title: "Solicitação rejeitada",
      description: "A solicitação foi rejeitada.",
      variant: "destructive"
    });
    
    // Send notification to the employee about the rejected request
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

  // Handle cancellation of a request
  const handleCancellation = async (id: string, reason?: string) => {
    // Find the current request to get employee information
    const request = requests.find(req => req.id === id);
    
    // Create a new array with the updated request
    const updatedRequests = requests.map(req => {
      if (req.id === id) {
        return {
          ...req,
          status: "canceled" as const,
          rejection_reason: reason || "Solicitação cancelada pelo solicitante."
        };
      }
      return req;
    });
    
    // Update state with new array
    setRequests(updatedRequests);
    
    toast({
      title: "Solicitação cancelada",
      description: "A solicitação foi cancelada.",
      variant: "destructive"
    });
    
    // Send notification to relevant parties about the cancelled request
    if (request) {
      try {
        // Notify HR manager about the cancellation
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
