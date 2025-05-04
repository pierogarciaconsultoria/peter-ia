
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
import { differenceInDays, isAfter } from "date-fns";

const ExternalAudit = () => {
  const [isNewAuditOpen, setIsNewAuditOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<ExternalAuditType | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Fetch audits data with proper error handling
  const { 
    data: audits = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
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
    setSelectedAudit(null);
  };

  const handleOpenReport = (audit: ExternalAuditType) => {
    setSelectedAudit(audit);
    setIsReportOpen(true);
  };

  const handleCloseReport = () => {
    setIsReportOpen(false);
  };

  const handleEditAudit = (audit: ExternalAuditType) => {
    setSelectedAudit(audit);
    setIsNewAuditOpen(true);
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

  // Get counts by status
  const getStatusCount = (status: string) => {
    return audits.filter(audit => audit.status === status).length;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className={`transition-all duration-300 pt-16 p-6 flex-1 ${sidebarCollapsed ? 'md:pl-24' : 'md:pl-72'}`}>
        <div className="max-w-7xl mx-auto w-full space-y-6">
          <ExternalAuditHeader 
            onNewAudit={handleNewAudit} 
            nextAudit={nextAudit}
            daysRemaining={daysRemaining}
          />
          
          <ExternalAuditStatusCards 
            scheduledCount={getStatusCount('scheduled')}
            inProgressCount={getStatusCount('in_progress')}
            completedCount={getStatusCount('completed')}
            cancelledCount={getStatusCount('cancelled')}
          />
          
          <ExternalAuditTable 
            audits={audits}
            isLoading={isLoading}
            onOpenReport={handleOpenReport}
            onEditAudit={handleEditAudit}
          />
        </div>
      </main>
      
      <ExternalAuditDialog 
        open={isNewAuditOpen}
        onClose={handleCloseDialog}
        audit={selectedAudit}
        onSuccess={refetch}
      />
      
      <ExternalAuditReportDialog 
        open={isReportOpen}
        onClose={handleCloseReport}
        audit={selectedAudit}
      />
      
      <Footer />
    </div>
  );
};

export default ExternalAudit;
