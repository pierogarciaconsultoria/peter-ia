
import { useState, useEffect } from "react";
import { ISORequirement } from "@/utils/isoRequirements";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DocumentForm } from "@/components/DocumentForm";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ImplementationSchedule } from "@/components/dashboard/ImplementationSchedule";
import { MaturityMetrics } from "@/components/dashboard/MaturityMetrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CalendarDays, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAudits } from "@/services/auditService";
import { getExternalAudits } from "@/services/externalAuditService";
import { formatDistanceToNow, format, isAfter } from "date-fns";
import { ptBR } from "date-fns/locale";
import { RequirementsList } from "@/components/RequirementsList";

interface DashboardProps {
  requirements: ISORequirement[];
}

export function Dashboard({ requirements }: DashboardProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<ISORequirement | null>(null);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSelectRequirement = (requirement: ISORequirement) => {
    setSelectedRequirement(requirement);
  };

  // Fetch internal and external audits
  const { data: internalAudits = [] } = useQuery({
    queryKey: ['audits-dashboard'],
    queryFn: getAudits,
    meta: {
      onSettled: (data, error) => {
        if (error) {
          console.error("Error fetching internal audits:", error);
        }
      }
    }
  });

  const { data: externalAudits = [] } = useQuery({
    queryKey: ['external-audits-dashboard'],
    queryFn: getExternalAudits,
    meta: {
      onSettled: (data, error) => {
        if (error) {
          console.error("Error fetching external audits:", error);
        }
      }
    }
  });

  // Filter upcoming audits (those with a future date)
  const today = new Date();
  
  const upcomingInternalAudits = internalAudits
    .filter(audit => {
      const auditDate = new Date(audit.audit_date);
      return isAfter(auditDate, today) && audit.status === 'planned';
    })
    .sort((a, b) => new Date(a.audit_date).getTime() - new Date(b.audit_date).getTime());

  const upcomingExternalAudits = externalAudits
    .filter(audit => {
      const auditDate = new Date(audit.audit_date);
      return isAfter(auditDate, today) && audit.status === 'scheduled';
    })
    .sort((a, b) => new Date(a.audit_date).getTime() - new Date(b.audit_date).getTime());

  const nextInternalAudit = upcomingInternalAudits.length > 0 ? upcomingInternalAudits[0] : null;
  const nextExternalAudit = upcomingExternalAudits.length > 0 ? upcomingExternalAudits[0] : null;

  return (
    <div className="mb-8 appear-animate" style={{ "--delay": 0 } as React.CSSProperties}>
      <DashboardHeader />
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Requisitos</h2>
          <p className="text-muted-foreground">
            Monitoramento e controle dos requisitos da norma, com foco na implementação
            e melhoria contínua do Sistema de Gestão da Qualidade.
          </p>
        </CardContent>
      </Card>
      
      {/* ISO Requirements Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            Requisitos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RequirementsList 
            requirements={requirements.slice(0, 6)} 
            onSelectRequirement={handleSelectRequirement} 
          />
          <div className="mt-4 text-center">
            <a href="/dashboard" className="text-primary hover:underline">
              Ver todos os requisitos
            </a>
          </div>
        </CardContent>
      </Card>
      
      {/* Upcoming Audits Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className={nextInternalAudit ? "border-blue-200" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-base">
              <Calendar className="mr-2 h-4 w-4 text-blue-500" />
              Próxima Auditoria Interna
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nextInternalAudit ? (
              <div className="space-y-2">
                <p className="font-medium">{nextInternalAudit.title}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarDays className="mr-1 h-4 w-4" />
                  {format(new Date(nextInternalAudit.audit_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </div>
                <p className="text-sm font-medium text-blue-600">
                  {formatDistanceToNow(new Date(nextInternalAudit.audit_date), { 
                    addSuffix: true, 
                    locale: ptBR 
                  })}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhuma auditoria interna agendada</p>
            )}
          </CardContent>
        </Card>

        <Card className={nextExternalAudit ? "border-green-200" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-base">
              <Calendar className="mr-2 h-4 w-4 text-green-500" />
              Próxima Auditoria Externa
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nextExternalAudit ? (
              <div className="space-y-2">
                <p className="font-medium">{nextExternalAudit.title}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarDays className="mr-1 h-4 w-4" />
                  {format(new Date(nextExternalAudit.audit_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </div>
                <p className="text-sm font-medium text-green-600">
                  {formatDistanceToNow(new Date(nextExternalAudit.audit_date), { 
                    addSuffix: true, 
                    locale: ptBR 
                  })}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhuma auditoria externa agendada</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <ImplementationSchedule />
      
      <MaturityMetrics requirements={requirements} />
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DocumentForm document={null} onClose={handleCloseDialog} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
