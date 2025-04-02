
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GitBranch, FileText, Clock, BarChart2 } from "lucide-react";

interface ReportTabListProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function ReportTabList({ activeTab, onTabChange }: ReportTabListProps) {
  return (
    <TabsList className="grid grid-cols-4 mb-8">
      <TabsTrigger value="bpmn" className="flex items-center gap-2">
        <GitBranch className="h-4 w-4" />
        <span>Diagrama BPMN</span>
      </TabsTrigger>
      <TabsTrigger value="analysis" className="flex items-center gap-2">
        <FileText className="h-4 w-4" />
        <span>Análise do Processo</span>
      </TabsTrigger>
      <TabsTrigger value="vsm" className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <span>Mapa de Valor (VSM)</span>
      </TabsTrigger>
      <TabsTrigger value="action" className="flex items-center gap-2">
        <BarChart2 className="h-4 w-4" />
        <span>Plano de Ação</span>
      </TabsTrigger>
    </TabsList>
  );
}

