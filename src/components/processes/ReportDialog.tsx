
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs } from "@/components/ui/tabs";
import { ReportHeader } from "@/components/processes/report/ReportHeader";
import { ReportFooter } from "@/components/processes/report/ReportFooter";
import { ReportTabList } from "@/components/processes/report/ReportTabList";
import { ReportTabs } from "@/components/processes/report/ReportTabs";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ReportDialogProps {
  processData: any;
  open: boolean;
  onClose: () => void;
  onEdit?: () => void;
  isEditable?: boolean;
  processId?: number | null;
}

export function ReportDialog({ 
  processData, 
  open, 
  onClose,
  onEdit,
  isEditable = false,
  processId = null
}: ReportDialogProps) {
  const [activeTab, setActiveTab] = useState("bpmn");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleDownload = async () => {
    toast.info("Preparando download do relatório...");
    
    try {
      const reportElement = document.getElementById('report-content');
      
      if (!reportElement) {
        throw new Error("Elemento do relatório não encontrado.");
      }

      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      
      pdf.addImage(imgData, 'PNG', imgX, 0, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`Relatório_${processData?.name || 'Processo'}.pdf`);
      
      toast.success("Relatório baixado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao baixar o relatório.");
    }
  };

  const handleShare = () => {
    toast.info("Funcionalidade de compartilhamento será implementada em breve!");
  };

  const handleDelete = () => {
    if (processId) {
      // In a real application, you would delete the process from the database here
      toast.success("Processo excluído com sucesso!");
      onClose();
    } else {
      toast.error("Não foi possível excluir o processo.");
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col overflow-hidden">
        <ReportHeader 
          processName={processData?.name} 
          onEdit={handleEdit}
          canEdit={isEditable}
        />
        
        <div className="flex-1 overflow-y-auto py-4" id="report-content">
          <Tabs value={activeTab} defaultValue="bpmn" className="w-full">
            <ReportTabList 
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
            
            <ReportTabs 
              activeTab={activeTab}
              processData={processData}
            />
          </Tabs>
        </div>
        
        <ReportFooter 
          onClose={onClose} 
          onDownload={handleDownload} 
          onShare={handleShare}
          onDelete={handleDelete}
          showDelete={!!processId}
        />
      </DialogContent>
    </Dialog>
  );
}
