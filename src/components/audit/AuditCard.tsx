
import { format, differenceInDays, isAfter } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Audit } from "@/services/auditService";

interface AuditCardProps {
  audit: Audit;
}

export const AuditCard = ({ audit }: AuditCardProps) => {
  // Map status to badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-amber-100 text-amber-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Map status to display text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'planned':
        return 'Planejada';
      case 'in_progress':
        return 'Em Andamento';
      case 'completed':
        return 'Concluída';
      case 'canceled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  // Calculate days remaining if audit is planned
  const getDaysRemaining = () => {
    if (audit.status === 'planned') {
      const today = new Date();
      const auditDate = new Date(audit.audit_date);
      if (isAfter(auditDate, today)) {
        const days = differenceInDays(auditDate, today);
        return (
          <div className="mt-2 text-xs font-medium text-amber-600">
            {days === 1 ? 'Falta 1 dia' : `Faltam ${days} dias`}
          </div>
        );
      }
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle>{audit.title}</CardTitle>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(audit.status)}`}>
            {getStatusText(audit.status)}
          </span>
        </div>
        <CardDescription>
          Área: {audit.area} | Responsável: {audit.responsible}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {audit.description && <p className="text-sm text-muted-foreground">{audit.description}</p>}
          <div className="flex items-center justify-between text-sm">
            <span>Data: {format(new Date(audit.audit_date), 'PPP', { locale: ptBR })}</span>
            {audit.completion_date && (
              <span>Conclusão: {format(new Date(audit.completion_date), 'PPP', { locale: ptBR })}</span>
            )}
          </div>
          {getDaysRemaining()}
        </div>
      </CardContent>
    </Card>
  );
};
