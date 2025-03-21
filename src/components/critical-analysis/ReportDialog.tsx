
import React, { useRef, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { AnalysisReport } from "./AnalysisReport";
import { CriticalAnalysisItem } from "@/types/critical-analysis";
import { ReportGenerator } from "./ReportGenerator";
import { ReportActions } from "./ReportActions";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ReportDialogProps {
  analysis: CriticalAnalysisItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAnalysisUpdate?: (updatedAnalysis: CriticalAnalysisItem) => void;
}

export function ReportDialog({ analysis, open, onOpenChange, onAnalysisUpdate }: ReportDialogProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!analysis) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Relatório de Análise Crítica</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center justify-end mb-4 gap-2">
          <ReportGenerator 
            analysis={analysis} 
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
            onAnalysisUpdate={onAnalysisUpdate}
          />
        </div>
        
        <ScrollArea className="h-[calc(90vh-180px)]">
          <AnalysisReport analysis={analysis} ref={reportRef} />
        </ScrollArea>
        
        <ReportActions 
          analysis={analysis} 
          reportRef={reportRef} 
          onClose={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
}
