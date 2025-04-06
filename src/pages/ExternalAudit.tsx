
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ExternalAuditHeader } from "@/components/external-audit/ExternalAuditHeader";
import { ExternalAuditStatusCards } from "@/components/external-audit/ExternalAuditStatusCards";
import { ExternalAuditTable } from "@/components/external-audit/ExternalAuditTable";
import { ExternalAuditForm } from "@/components/external-audit/ExternalAuditForm";
import { ExternalAuditDialog } from "@/components/external-audit/ExternalAuditDialog";
import { ExternalAuditReportDialog } from "@/components/external-audit/ExternalAuditReportDialog";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  getExternalAudits, 
  createExternalAudit, 
  ExternalAudit 
} from "@/services/externalAuditService";

const ExternalAuditPage = () => {
  const [isNewAuditDialogOpen, setIsNewAuditDialogOpen] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<ExternalAudit | null>(null);
  const [isAuditDialogOpen, setIsAuditDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { 
    data: audits = [], 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['externalAudits'],
    queryFn: getExternalAudits,
  });

  const openNewAuditDialog = () => {
    setIsNewAuditDialogOpen(true);
  };

  const closeNewAuditDialog = () => {
    setIsNewAuditDialogOpen(false);
  };

  const handleCreateAudit = async (values: any) => {
    setIsSubmitting(true);
    try {
      await createExternalAudit({
        ...values,
        audit_date: values.audit_date.toISOString(),
        completion_date: values.completion_date ? values.completion_date.toISOString() : null,
      });
      toast.success("Auditoria criada com sucesso");
      closeNewAuditDialog();
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar auditoria");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditAudit = (audit: ExternalAudit) => {
    setSelectedAudit(audit);
    setIsAuditDialogOpen(true);
  };

  const handleViewAudit = (audit: ExternalAudit) => {
    setSelectedAudit(audit);
    setIsReportDialogOpen(true);
  };

  const handleAuditUpdated = () => {
    refetch();
  };

  const handleShareAudit = (audit: ExternalAudit) => {
    if (audit.report_url) {
      try {
        navigator.clipboard.writeText(audit.report_url);
        toast.success("Link do relatório copiado para a área de transferência");
      } catch (error) {
        toast.error("Não foi possível copiar o link");
        console.error(error);
      }
    }
  };

  const handleDownloadAudit = (audit: ExternalAudit) => {
    if (audit.report_url) {
      window.open(audit.report_url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="md:pl-64 p-6 transition-all duration-300 flex-1">
        <div className="max-w-6xl mx-auto">
          <ExternalAuditHeader onNewAudit={openNewAuditDialog} />
          
          {isLoading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, index) => (
                  <Skeleton key={index} className="h-24 w-full" />
                ))}
              </div>
              <Skeleton className="h-[400px] w-full" />
            </div>
          ) : (
            <>
              <ExternalAuditStatusCards audits={audits} />
              <ExternalAuditTable 
                audits={audits}
                onEdit={handleEditAudit}
                onView={handleViewAudit}
                onShare={handleShareAudit}
                onDownload={handleDownloadAudit}
              />
            </>
          )}
        </div>
      </main>

      {/* Dialog for creating a new audit */}
      <Dialog open={isNewAuditDialogOpen} onOpenChange={closeNewAuditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Auditoria Externa</DialogTitle>
          </DialogHeader>
          <ExternalAuditForm 
            onSubmit={handleCreateAudit}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog for editing an existing audit */}
      <ExternalAuditDialog 
        audit={selectedAudit} 
        isOpen={isAuditDialogOpen} 
        onClose={() => setIsAuditDialogOpen(false)}
        onSave={handleAuditUpdated}
      />

      {/* Dialog for viewing an audit report */}
      <ExternalAuditReportDialog 
        audit={selectedAudit}
        isOpen={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
        onShare={handleShareAudit}
        onDownload={handleDownloadAudit}
      />
      
      <Footer />
    </div>
  );
};

export default ExternalAuditPage;
