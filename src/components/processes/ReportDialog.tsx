
import React, { useState } from "react";
import { 
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { ReportHeader } from "./report/ReportHeader";
import { ReportFooter } from "./report/ReportFooter";
import { ReportTabs } from "./report/ReportTabs";
import { useReportAnalysis } from "./report/useReportAnalysis";

interface ReportDialogProps {
  processData: any;
  open: boolean;
  onClose: () => void;
}

export function ReportDialog({ processData, open, onClose }: ReportDialogProps) {
  const [activeTab, setActiveTab] = useState("bpmn");
  const { isAnalyzing, analysisData } = useReportAnalysis(processData, open);
  
  if (!open) return null;

  const handleDownload = () => {
    // In a real implementation, this would generate a PDF download
    console.log("Downloading report...");
    // Implementation would go here
  };

  const handleShare = () => {
    // In a real implementation, this would show sharing options
    console.log("Sharing report...");
    // Implementation would go here
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <ReportHeader processName={processData?.name} />

        <ReportTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          processData={processData}
          isAnalyzing={isAnalyzing}
          analysisData={analysisData}
        />

        <ReportFooter 
          onClose={onClose}
          onDownload={handleDownload}
          onShare={handleShare}
        />
      </DialogContent>
    </Dialog>
  );
}
