
import { CustomerComplaint } from "@/services/customerComplaintService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronRight, ChevronLeft, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ComplaintKanbanCardProps {
  complaint: CustomerComplaint;
  onStatusChange: (complaint: CustomerComplaint, status: CustomerComplaint['detailed_status']) => void;
  isDisabled: boolean;
}

export function ComplaintKanbanCard({ 
  complaint, 
  onStatusChange,
  isDisabled
}: ComplaintKanbanCardProps) {
  // Get the next and previous status based on the current status
  const getNextStatus = (currentStatus: CustomerComplaint['detailed_status']): CustomerComplaint['detailed_status'] | null => {
    switch (currentStatus) {
      case 'nova_reclamacao': return 'analise_reclamacao';
      case 'analise_reclamacao': return 'identificacao_causa';
      case 'identificacao_causa': return 'acao';
      case 'acao': return 'acompanhamento';
      case 'acompanhamento': return 'conclusao';
      case 'conclusao': return null;
      default: return null;
    }
  };

  const getPreviousStatus = (currentStatus: CustomerComplaint['detailed_status']): CustomerComplaint['detailed_status'] | null => {
    switch (currentStatus) {
      case 'nova_reclamacao': return null;
      case 'analise_reclamacao': return 'nova_reclamacao';
      case 'identificacao_causa': return 'analise_reclamacao';
      case 'acao': return 'identificacao_causa';
      case 'acompanhamento': return 'acao';
      case 'conclusao': return 'acompanhamento';
      default: return null;
    }
  };

  const nextStatus = getNextStatus(complaint.detailed_status || 'nova_reclamacao');
  const previousStatus = getPreviousStatus(complaint.detailed_status || 'nova_reclamacao');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'low': return 'Baixa';
      case 'medium': return 'Média';
      case 'high': return 'Alta';
      case 'critical': return 'Crítica';
      default: return priority;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="bg-white p-3 rounded-md border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <h4 className="font-medium text-sm line-clamp-2">{complaint.customer_name}</h4>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="sr-only">Opções</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="z-50 bg-white">
            <DropdownMenuLabel>Mover para</DropdownMenuLabel>
            {previousStatus && (
              <DropdownMenuItem
                onClick={() => onStatusChange(complaint, previousStatus)}
                disabled={isDisabled}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Voltar etapa
              </DropdownMenuItem>
            )}
            {nextStatus && (
              <DropdownMenuItem
                onClick={() => onStatusChange(complaint, nextStatus)}
                disabled={isDisabled}
              >
                Próxima etapa
                <ChevronRight className="h-4 w-4 ml-2" />
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-2 space-y-2">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className={`${getPriorityColor(complaint.priority)}`}>
            {getPriorityText(complaint.priority)}
          </Badge>
          {complaint.identification_code && (
            <Badge variant="outline">{complaint.identification_code}</Badge>
          )}
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground">
          <span>Data: {formatDate(complaint.complaint_date)}</span>
        </div>
        
        {complaint.product && (
          <div className="flex items-center text-xs">
            <span className="font-medium">Produto:</span>
            <span className="ml-1 truncate">{complaint.product}</span>
          </div>
        )}
      </div>
    </div>
  );
}
