
import { useToast } from "@/hooks/use-toast";
import { PersonnelRequest } from "../types";
import { CheckCircle, AlertCircle } from "lucide-react";
import { createNotification } from "@/services/notificationService";
import { supabase } from "@/integrations/supabase/client";

export function useRequestActions(requests: PersonnelRequest[], setRequests: React.Dispatch<React.SetStateAction<PersonnelRequest[]>>) {
  const { toast } = useToast();
  
  // Handle approval of a request
  const handleApproval = async (id: string) => {
    // Find the current request to get employee information
    const request = requests.find(req => req.id === id);
    
    setRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === id 
          ? { 
              ...req, 
              status: "approved", 
              approved_by: "Gestor",
              approval_date: new Date().toISOString().split('T')[0]
            } 
          : req
      )
    );
    
    toast({
      title: "Solicitação aprovada",
      description: "A solicitação foi aprovada com sucesso.",
      action: (
        <div className="bg-green-50 border border-green-100 px-2 py-1 rounded-md flex items-center gap-2 text-green-700">
          <CheckCircle className="h-4 w-4" />
          <span className="text-xs">Aprovado</span>
        </div>
      )
    });
    
    // Send notification to the employee about the approved request
    if (request && request.employee_id) {
      try {
        await createNotification(
          request.employee_id,
          "Solicitação Aprovada",
          `Sua solicitação de ${request.type} foi aprovada.`,
          "personnel_request",
          id
        );
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    }
  };

  // Handle rejection of a request
  const handleRejection = async (id: string, reason?: string) => {
    // Find the current request to get employee information
    const request = requests.find(req => req.id === id);
    
    setRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === id ? { 
          ...req, 
          status: "rejected",
          rejection_reason: reason || "Solicitação rejeitada pelo gestor."
        } : req
      )
    );
    
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
    
    setRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === id ? { 
          ...req, 
          status: "canceled",
          rejection_reason: reason || "Solicitação cancelada pelo solicitante."
        } : req
      )
    );
    
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
