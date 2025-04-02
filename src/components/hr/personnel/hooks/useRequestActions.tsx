
import { useToast } from "@/components/ui/use-toast";
import { PersonnelRequest } from "../types";
import { CheckCircle, AlertCircle } from "lucide-react";

export function useRequestActions(requests: PersonnelRequest[], setRequests: React.Dispatch<React.SetStateAction<PersonnelRequest[]>>) {
  const { toast } = useToast();
  
  // Handle approval of a request
  const handleApproval = (id: string) => {
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
  };

  // Handle rejection of a request
  const handleRejection = (id: string, reason?: string) => {
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
  };

  // Handle cancellation of a request
  const handleCancellation = (id: string, reason?: string) => {
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
  };

  return {
    handleApproval,
    handleRejection,
    handleCancellation
  };
}
