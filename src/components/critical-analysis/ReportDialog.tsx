import React, { useRef, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Download, X, Sparkles, RefreshCw } from "lucide-react";
import { AnalysisReport } from "./AnalysisReport";
import { CriticalAnalysisItem } from "@/types/critical-analysis";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { supabase } from "@/integrations/supabase/client";

interface ReportDialogProps {
  analysis: CriticalAnalysisItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAnalysisUpdate?: (updatedAnalysis: CriticalAnalysisItem) => void;
}

export function ReportDialog({ analysis, open, onOpenChange, onAnalysisUpdate }: ReportDialogProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePrint = () => {
    if (!reportRef.current) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Não foi possível abrir uma nova janela para impressão");
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Relatório de Análise Crítica - ${analysis?.subject}</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .badge { 
              display: inline-block;
              border-radius: 9999px;
              padding: 2px 8px;
              font-size: 12px;
              font-weight: 500;
              background-color: #f3f4f6;
            }
            .separator {
              border: none;
              border-top: 1px solid #e5e7eb;
              margin: 24px 0;
            }
          </style>
        </head>
        <body>
          ${reportRef.current.innerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const handleExportPDF = async () => {
    if (!reportRef.current || !analysis) return;
    
    try {
      toast.info("Gerando PDF, aguarde...");
      
      const canvas = await html2canvas(reportRef.current, { 
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      let position = 0;
      
      while (position < imgHeight) {
        if (position > 0) {
          pdf.addPage();
        }
        
        pdf.addImage(
          imgData, 
          'PNG', 
          0, 
          -position, 
          imgWidth, 
          imgHeight
        );
        
        position += 265;
      }
      
      const fileName = `analise-critica-${analysis.subject.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
      
      pdf.save(fileName);
      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Ocorreu um erro ao gerar o PDF. Tente novamente.");
    }
  };

  const generateAIReport = async () => {
    if (!analysis) return;
    
    setIsGenerating(true);
    toast.info("Gerando relatório com IA, aguarde...");
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-report', {
        body: { analysis },
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data || !data.report) {
        throw new Error("Não foi possível gerar o relatório");
      }
      
      const updatedAnalysis = {
        ...analysis,
        aiGeneratedContent: data.report
      };
      
      if (onAnalysisUpdate) {
        onAnalysisUpdate(updatedAnalysis);
      }
      
      toast.success("Relatório gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      toast.error("Ocorreu um erro ao gerar o relatório. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!analysis) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Relatório de Análise Crítica</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center justify-end mb-4 gap-2">
          <Button 
            variant="outline" 
            onClick={generateAIReport} 
            disabled={isGenerating}
            title="Gerar relatório detalhado com IA"
          >
            {isGenerating ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
            Relatório Detalhado com IA
          </Button>
        </div>
        
        <AnalysisReport analysis={analysis} ref={reportRef} />
        
        <DialogFooter className="mt-6 flex items-center justify-between sm:justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Fechar
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
