
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Edit,
  FileText,
  Loader2
} from "lucide-react";
import { ExternalAudit } from "@/services/externalAuditService";

interface ExternalAuditTableProps {
  audits: ExternalAudit[];
  isLoading: boolean;
  onOpenReport: (audit: ExternalAudit) => void;
  onEditAudit: (audit: ExternalAudit) => void;
}

export function ExternalAuditTable({ 
  audits, 
  isLoading,
  onOpenReport,
  onEditAudit
}: ExternalAuditTableProps) {
  const getStatusBadge = (status: ExternalAudit['status']) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Agendada</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Em Andamento</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Concluída</Badge>;
      case 'canceled':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Cancelada</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

  if (isLoading) {
    return (
      <div className="text-center p-8 border rounded-md">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
        <p>Carregando auditorias...</p>
      </div>
    );
  }

  if (!audits.length) {
    return (
      <div className="text-center p-8 border rounded-md">
        <h3 className="font-medium text-xl mb-2">Nenhuma auditoria encontrada</h3>
        <p className="text-muted-foreground">
          Crie uma nova auditoria para começar a gerenciar o processo.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Auditor</TableHead>
            <TableHead>Data da Auditoria</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {audits.map((audit) => (
            <TableRow key={audit.id}>
              <TableCell className="font-medium">{audit.title}</TableCell>
              <TableCell>{audit.external_auditor}</TableCell>
              <TableCell className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {formatDate(audit.audit_date)}
              </TableCell>
              <TableCell>{getStatusBadge(audit.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onOpenReport(audit)}
                    title="Visualizar relatório"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onEditAudit(audit)}
                    title="Editar auditoria"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
