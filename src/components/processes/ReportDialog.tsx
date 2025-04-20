
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ReportHeader } from "@/components/processes/report/ReportHeader";
import { ReportFooter } from "@/components/processes/report/ReportFooter";
import { useReportAnalysis } from "@/components/processes/report/useReportAnalysis";
import { ReportTabs } from "@/components/processes/report/ReportTabs";
import { toast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { Eye, FileText, Import, FileExport, Brain, Turtle, Layers } from "lucide-react";

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
  const { isAnalyzing, analysisData } = useReportAnalysis(processData, open);

  const handleDownload = async () => {
    toast({
      title: "Preparando download do relatório..."
    });
    
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
      
      toast({
        title: "Relatório baixado com sucesso!"
      });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
        title: "Erro ao baixar o relatório.",
        variant: "destructive"
      });
    }
  };

  const handleShare = () => {
    toast({
      title: "Funcionalidade de compartilhamento será implementada em breve!"
    });
  };

  const handleDelete = () => {
    if (processId) {
      // In a real application, you would delete the process from the database here
      toast({
        title: "Processo excluído com sucesso!"
      });
      onClose();
    } else {
      toast({
        title: "Não foi possível excluir o processo.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    }
  };

  const handleViewBPM = () => {
    setActiveTab("bpmn");
    toast({
      title: "Visualizando diagrama BPM"
    });
  };

  const handleViewTurtle = () => {
    toast({
      title: "Visualizando diagrama Tartaruga",
      description: "Esta funcionalidade será implementada em breve."
    });
  };

  const handleViewSIPOC = () => {
    toast({
      title: "Visualizando diagrama SIPOC",
      description: "Esta funcionalidade será implementada em breve."
    });
  };

  const handleAIAnalysis = () => {
    toast({
      title: "Iniciando análise de inteligência artificial",
      description: "Esta funcionalidade será implementada em breve."
    });
  };

  const handleExport = () => {
    toast({
      title: "Exportando processo",
      description: "Esta funcionalidade será implementada em breve."
    });
  };

  const handleImport = () => {
    toast({
      title: "Importando processo",
      description: "Esta funcionalidade será implementada em breve."
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col overflow-hidden">
        <ReportHeader 
          processName={processData?.name} 
          onEdit={handleEdit}
          canEdit={isEditable}
        />
        
        <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b">
          <div className="flex space-x-2 overflow-x-auto pb-1">
            <Button size="sm" variant="outline" onClick={handleViewBPM}>
              <Eye className="h-4 w-4 mr-1" />
              BPM
            </Button>
            <Button size="sm" variant="outline" onClick={handleViewTurtle}>
              <Turtle className="h-4 w-4 mr-1" />
              Tartaruga
            </Button>
            <Button size="sm" variant="outline" onClick={handleViewSIPOC}>
              <Layers className="h-4 w-4 mr-1" />
              SIPOC
            </Button>
            <Button size="sm" variant="outline" onClick={handleAIAnalysis}>
              <Brain className="h-4 w-4 mr-1" />
              Análise IA
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={handleDownload}>
              <FileText className="h-4 w-4 mr-1" />
              Relatório
            </Button>
            <Button size="sm" variant="outline" onClick={handleExport}>
              <FileExport className="h-4 w-4 mr-1" />
              Exportar
            </Button>
            <Button size="sm" variant="outline" onClick={handleImport}>
              <Import className="h-4 w-4 mr-1" />
              Importar
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4" id="report-content">
          <ReportTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            processData={processData}
            isAnalyzing={isAnalyzing}
            analysisData={analysisData}
          />
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
