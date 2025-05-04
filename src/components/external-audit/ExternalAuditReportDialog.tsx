import React from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar, 
  Download, 
  Share2, 
  FileText,
  User,
  Building,
  Clock
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { ExternalAudit } from "@/services/externalAuditService";
import { toast } from "sonner";

interface ExternalAuditReportDialogProps {
  audit: ExternalAudit | null;
  open: boolean;
  onClose: () => void;
}

export function ExternalAuditReportDialog({
  audit,
  open,
  onClose
}: ExternalAuditReportDialogProps) {
  if (!audit) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Não definida";
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

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

  const handleDownload = () => {
    if (audit.report_url) {
      window.open(audit.report_url, '_blank');
    }
  };

  const handleShare = async () => {
    if (audit.report_url) {
      try {
        await navigator.clipboard.writeText(audit.report_url);
        // Using the imported toast directly
        toast.success("Link copiado para a área de transferência");
      } catch (err) {
        console.error("Erro ao copiar link:", err);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Relatório de Auditoria</DialogTitle>
          <DialogDescription>
            Detalhes completos da auditoria externa
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h2 className="text-2xl font-bold">{audit.title}</h2>
            <div>{getStatusBadge(audit.status)}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">Data da Auditoria</h3>
                </div>
                <p>{formatDate(audit.audit_date)}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">Auditor</h3>
                </div>
                <p>{audit.external_auditor}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">Empresa</h3>
                </div>
                <p>{audit.auditor_company || "Não informada"}</p>
              </CardContent>
            </Card>
          </div>

          {audit.completion_date && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">Data de Conclusão</h3>
                </div>
                <p>{formatDate(audit.completion_date)}</p>
              </CardContent>
            </Card>
          )}

          {audit.description && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Descrição</h3>
              <div className="p-4 rounded-md bg-muted/50">
                <p className="whitespace-pre-line">{audit.description}</p>
              </div>
            </div>
          )}

          {audit.findings && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Constatações e Não Conformidades</h3>
              <div className="p-4 rounded-md bg-muted/50">
                <p className="whitespace-pre-line">{audit.findings}</p>
              </div>
            </div>
          )}

          {audit.report_url && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Documento do Relatório</h3>
              <div className="p-4 rounded-md bg-muted/50 flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <a 
                  href={audit.report_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline break-all"
                >
                  {audit.report_url.split('/').pop() || "Relatório de Auditoria"}
                </a>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex space-x-2">
            {audit.report_url && (
              <>
                <Button 
                  onClick={handleShare} 
                  variant="outline"
                  className="gap-1"
                >
                  <Share2 className="h-4 w-4" />
                  Compartilhar
                </Button>
                <Button 
                  onClick={handleDownload}
                  className="gap-1"
                >
                  <Download className="h-4 w-4" />
                  Baixar Relatório
                </Button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
