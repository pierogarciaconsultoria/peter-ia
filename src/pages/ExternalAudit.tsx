
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ExternalAuditHeader } from "@/components/external-audit/ExternalAuditHeader";
import { ExternalAuditStatusCards } from "@/components/external-audit/ExternalAuditStatusCards";
import { ExternalAuditTable } from "@/components/external-audit/ExternalAuditTable";
import { ExternalAuditDialog } from "@/components/external-audit/ExternalAuditDialog";
import { ExternalAuditReportDialog } from "@/components/external-audit/ExternalAuditReportDialog";
import { ExternalAudit as ExternalAuditType } from "@/services/externalAuditService";
import { useQuery } from "@tanstack/react-query";
import { getExternalAudits } from "@/services/externalAuditService";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Calendar, CalendarDays } from "lucide-react";
import { differenceInDays, format, formatDistanceToNow, isAfter } from "date-fns";
import { ptBR } from "date-fns/locale";

const ExternalAudit = () => {
  const [isNewAuditOpen, setIsNewAuditOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<ExternalAuditType | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Fetch audits data
  const { data: audits = [], isLoading, refetch } = useQuery({
    queryKey: ['external-audits'],
    queryFn: getExternalAudits,
    meta: {
      onSettled: (data, error) => {
        if (error) {
          console.error("Error fetching audits:", error);
          toast.error("Erro ao carregar auditorias externas");
        }
      }
    }
  });

  // Find next scheduled audit
  const today = new Date();
  const upcomingAudits = audits
    .filter(audit => {
      const auditDate = new Date(audit.audit_date);
      return isAfter(auditDate, today) && audit.status === 'scheduled';
    })
    .sort((a, b) => new Date(a.audit_date).getTime() - new Date(b.audit_date).getTime());

  const nextAudit = upcomingAudits.length > 0 ? upcomingAudits[0] : null;
  
  // Calculate days remaining for next audit
  const daysRemaining = nextAudit ? 
    differenceInDays(new Date(nextAudit.audit_date), today) : null;

  const handleNewAudit = () => {
    setIsNewAuditOpen(true);
  };

  const handleCloseDialog = () => {
    setIsNewAuditOpen(false);
    refetch();
  };

  const handleOpenReport = (audit: ExternalAuditType) => {
    setSelectedAudit(audit);
    setIsReportOpen(true);
  };

  const handleCloseReport = () => {
    setIsReportOpen(false);
    setSelectedAudit(null);
    refetch();
  };

  const handleSaveAudit = (audit: ExternalAuditType) => {
    refetch();
  };

  const handleEditAudit = (audit: ExternalAuditType) => {
    setSelectedAudit(audit);
    setIsNewAuditOpen(true);
  };

  const handleShareAudit = (audit: ExternalAuditType) => {
    if (audit.report_url) {
      navigator.clipboard.writeText(audit.report_url);
      toast.success("Link do relatório copiado para a área de transferência");
    }
  };

  const handleDownloadAudit = (audit: ExternalAuditType) => {
    if (audit.report_url) {
      window.open(audit.report_url, '_blank');
    }
  };

  // Detect if sidebar is collapsed
  useEffect(() => {
    const checkSidebarState = () => {
      const sidebar = document.querySelector('[class*="md:w-20"]');
      setSidebarCollapsed(!!sidebar);
    };
    
    // Check sidebar state periodically
    const interval = setInterval(checkSidebarState, 500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className={`transition-all duration-300 pt-16 p-6 flex-1 ${sidebarCollapsed ? 'md:pl-24' : 'md:pl-72'}`}>
        <div className="max-w-6xl mx-auto space-y-6">
          <ExternalAuditHeader onNewAudit={handleNewAudit} />
          
          {/* Next Audit Countdown Card */}
          {nextAudit && (
            <Card className="mb-4 border-green-200 bg-green-50/30">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-green-600" />
                  Próxima Auditoria Externa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Título</h3>
                    <p className="text-base font-medium">{nextAudit.title}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Data</h3>
                    <p className="text-base font-medium flex items-center">
                      <CalendarDays className="mr-2 h-4 w-4 text-green-600" />
                      {format(new Date(nextAudit.audit_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                    <div className="flex items-center">
                      <AlertCircle className="mr-2 h-4 w-4 text-amber-500" />
                      <p className="text-base font-bold text-amber-600">
                        {daysRemaining === 1 ? 'Falta 1 dia' : `Faltam ${daysRemaining} dias`}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <ExternalAuditStatusCards audits={audits} />
          
          <ExternalAuditTable 
            audits={audits} 
            onEdit={handleEditAudit}
            onView={handleOpenReport}
            onShare={handleShareAudit}
            onDownload={handleDownloadAudit}
          />
        </div>
      </main>
      
      <ExternalAuditDialog 
        isOpen={isNewAuditOpen}
        onClose={handleCloseDialog}
        audit={selectedAudit}
        onSave={handleSaveAudit}
      />
      
      {selectedAudit && (
        <ExternalAuditReportDialog
          isOpen={isReportOpen}
          onClose={handleCloseReport}
          audit={selectedAudit}
          onDownload={handleDownloadAudit}
          onShare={handleShareAudit}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default ExternalAudit;
