
import React from "react";
import { Button } from "@/components/ui/button";
import { Printer, Download, X } from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog";
import { exportToPDF, printReport } from "./utils/export-utils";
import { CriticalAnalysisItem } from "@/types/critical-analysis";

interface ReportActionsProps {
  analysis: CriticalAnalysisItem;
  reportRef: React.RefObject<HTMLDivElement>;
  onClose: () => void;
}

export function ReportActions({ analysis, reportRef, onClose }: ReportActionsProps) {
  const handlePrint = () => {
    printReport(reportRef, `Relatório de Análise Crítica - ${analysis.subject}`);
  };

  const handleExportPDF = async () => {
    if (!analysis) return;
    
    const fileName = `analise-critica-${analysis.subject.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
    
    await exportToPDF(reportRef, fileName);
  };

  return (
    <DialogFooter className="mt-6 flex items-center justify-between sm:justify-end gap-2">
      <Button variant="outline" onClick={onClose}>
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
  );
}
