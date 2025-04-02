
import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { BpmnDiagram } from "@/components/processes/BpmnDiagram";
import { ProcessAnalysis } from "@/components/processes/ProcessAnalysis";
import { ValueStreamMap } from "@/components/processes/ValueStreamMap";
import { ActionPlan } from "@/components/processes/ActionPlan";
import { ReportTabList } from "./ReportTabList";
import { ReportLoadingState } from "./ReportLoadingState";

interface ReportTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  processData: any;
  isAnalyzing: boolean;
  analysisData: any;
}

export function ReportTabs({ activeTab, setActiveTab, processData, isAnalyzing, analysisData }: ReportTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
      <ReportTabList activeTab={activeTab} onTabChange={setActiveTab} />
      
      <TabsContent value="bpmn" className="border rounded-md p-4">
        {isAnalyzing ? (
          <ReportLoadingState type="bpmn" />
        ) : (
          <BpmnDiagram processData={processData} />
        )}
      </TabsContent>
      
      <TabsContent value="analysis" className="border rounded-md p-4">
        {isAnalyzing ? (
          <ReportLoadingState type="analysis" />
        ) : (
          <ProcessAnalysis analysisData={analysisData} />
        )}
      </TabsContent>
      
      <TabsContent value="vsm" className="border rounded-md p-4">
        {isAnalyzing ? (
          <ReportLoadingState type="vsm" />
        ) : (
          <ValueStreamMap vsmData={analysisData?.vsm} processData={processData} />
        )}
      </TabsContent>
      
      <TabsContent value="action" className="border rounded-md p-4">
        {isAnalyzing ? (
          <ReportLoadingState type="action" />
        ) : (
          <ActionPlan actionPlanData={analysisData?.actionPlan} />
        )}
      </TabsContent>
    </Tabs>
  );
}
