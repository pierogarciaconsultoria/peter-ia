import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalysisTable } from "./AnalysisTable";
import { CriticalAnalysisItem } from "@/types/critical-analysis";

interface AnalysisStatusTabsProps {
  analyses: CriticalAnalysisItem[];
  expandedItems: {[key: string]: boolean};
  toggleExpand: (id: string) => void;
  handleAttachmentClick: (analysisId: string) => void;
  handleViewReport: (analysis: CriticalAnalysisItem) => void;
  handleDeleteAttachment: (analysisId: string, attachmentId: string) => void;
  handleEditAnalysis: (analysis: CriticalAnalysisItem) => void;
  handleDeleteAnalysis: (analysisId: string) => void;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  getFileIcon: (fileType: string) => React.ReactNode;
  formatFileSize: (bytes: number) => string;
}

export function AnalysisStatusTabs({
  analyses,
  expandedItems,
  toggleExpand,
  handleAttachmentClick,
  handleViewReport,
  handleDeleteAttachment,
  handleEditAnalysis,
  handleDeleteAnalysis,
  getStatusColor,
  getStatusText,
  getFileIcon,
  formatFileSize
}: AnalysisStatusTabsProps) {
  const plannedAnalyses = analyses.filter(analysis => analysis.status === "planned");
  const inProgressAnalyses = analyses.filter(analysis => analysis.status === "in-progress");
  const completedAnalyses = analyses.filter(analysis => analysis.status === "completed");
  
  return (
    <Tabs defaultValue="planned" className="space-y-4">
      <TabsList>
        <TabsTrigger value="planned" className="relative">
          Planejadas
          {plannedAnalyses.length > 0 && (
            <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
              {plannedAnalyses.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="in-progress" className="relative">
          Em Andamento
          {inProgressAnalyses.length > 0 && (
            <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
              {inProgressAnalyses.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="completed" className="relative">
          Concluídas
          {completedAnalyses.length > 0 && (
            <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
              {completedAnalyses.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="all">
          Todas
          <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
            {analyses.length}
          </span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="planned" className="space-y-4">
        {plannedAnalyses.length === 0 ? (
          <div className="text-center p-4 bg-muted rounded-md">
            <p className="text-muted-foreground">Nenhuma análise crítica planejada.</p>
          </div>
        ) : (
          <AnalysisTable 
            analyses={plannedAnalyses}
            expandedItems={expandedItems}
            toggleExpand={toggleExpand}
            handleAttachmentClick={handleAttachmentClick}
            handleViewReport={handleViewReport}
            handleDeleteAttachment={handleDeleteAttachment}
            handleEditAnalysis={handleEditAnalysis}
            handleDeleteAnalysis={handleDeleteAnalysis}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
            getFileIcon={getFileIcon}
            formatFileSize={formatFileSize}
          />
        )}
      </TabsContent>
      
      <TabsContent value="in-progress" className="space-y-4">
        {inProgressAnalyses.length === 0 ? (
          <div className="text-center p-4 bg-muted rounded-md">
            <p className="text-muted-foreground">Nenhuma análise crítica em andamento.</p>
          </div>
        ) : (
          <AnalysisTable 
            analyses={inProgressAnalyses}
            expandedItems={expandedItems}
            toggleExpand={toggleExpand}
            handleAttachmentClick={handleAttachmentClick}
            handleViewReport={handleViewReport}
            handleDeleteAttachment={handleDeleteAttachment}
            handleEditAnalysis={handleEditAnalysis}
            handleDeleteAnalysis={handleDeleteAnalysis}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
            getFileIcon={getFileIcon}
            formatFileSize={formatFileSize}
          />
        )}
      </TabsContent>
      
      <TabsContent value="completed" className="space-y-4">
        {completedAnalyses.length === 0 ? (
          <div className="text-center p-4 bg-muted rounded-md">
            <p className="text-muted-foreground">Nenhuma análise crítica concluída.</p>
          </div>
        ) : (
          <AnalysisTable 
            analyses={completedAnalyses}
            expandedItems={expandedItems}
            toggleExpand={toggleExpand}
            handleAttachmentClick={handleAttachmentClick}
            handleViewReport={handleViewReport}
            handleDeleteAttachment={handleDeleteAttachment}
            handleEditAnalysis={handleEditAnalysis}
            handleDeleteAnalysis={handleDeleteAnalysis}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
            getFileIcon={getFileIcon}
            formatFileSize={formatFileSize}
          />
        )}
      </TabsContent>
      
      <TabsContent value="all" className="space-y-4">
        {analyses.length === 0 ? (
          <div className="text-center p-4 bg-muted rounded-md">
            <p className="text-muted-foreground">Nenhuma análise crítica registrada.</p>
          </div>
        ) : (
          <AnalysisTable 
            analyses={analyses}
            expandedItems={expandedItems}
            toggleExpand={toggleExpand}
            handleAttachmentClick={handleAttachmentClick}
            handleViewReport={handleViewReport}
            handleDeleteAttachment={handleDeleteAttachment}
            handleEditAnalysis={handleEditAnalysis}
            handleDeleteAnalysis={handleDeleteAnalysis}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
            getFileIcon={getFileIcon}
            formatFileSize={formatFileSize}
          />
        )}
      </TabsContent>
    </Tabs>
  );
}
