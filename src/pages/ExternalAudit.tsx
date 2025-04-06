
import { useState } from "react";
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
      onError: (error: Error) => {
        console.error("Error fetching audits:", error);
        toast.error("Erro ao carregar auditorias externas");
      }
    }
  });

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
  useState(() => {
    const checkSidebarState = () => {
      const sidebar = document.querySelector('[class*="md:w-20"]');
      setSidebarCollapsed(!!sidebar);
    };
    
    // Check sidebar state periodically
    const interval = setInterval(checkSidebarState, 500);
    
    return () => clearInterval(interval);
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className={`transition-all duration-300 pt-16 p-6 flex-1 ${sidebarCollapsed ? 'md:pl-24' : 'md:pl-72'}`}>
        <div className="max-w-6xl mx-auto space-y-6">
          <ExternalAuditHeader onNewAudit={handleNewAudit} />
          
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
