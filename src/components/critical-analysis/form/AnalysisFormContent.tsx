
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GeneralInfoSection } from "./GeneralInfoSection";
import { InputRequirementsSection } from "./InputRequirementsSection";
import { ResultsSection } from "./ResultsSection";
import { CriticalAnalysisItem } from "@/types/critical-analysis";

interface AnalysisFormContentProps {
  // General Info
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  plannedDate: Date | undefined;
  setPlannedDate: (date: Date | undefined) => void;
  status: "planned" | "in-progress" | "completed";
  setStatus: (status: "planned" | "in-progress" | "completed") => void;
  subject: string;
  setSubject: (subject: string) => void;
  participants: string;
  setParticipants: (participants: string) => void;
  documents: string;
  setDocuments: (documents: string) => void;
  
  // Requirements
  previousActionsStatus: string;
  setPreviousActionsStatus: (value: string) => void;
  externalInternalChanges: string;
  setExternalInternalChanges: (value: string) => void;
  performanceInfo: string;
  setPerformanceInfo: (value: string) => void;
  resourceSufficiency: string;
  setResourceSufficiency: (value: string) => void;
  riskActionsEffectiveness: string;
  setRiskActionsEffectiveness: (value: string) => void;
  improvementOpportunities: string;
  setImprovementOpportunities: (value: string) => void;
  
  // Results
  improvementResults: string;
  setImprovementResults: (value: string) => void;
  systemChangeNeeds: string;
  setSystemChangeNeeds: (value: string) => void;
  resourceNeeds: string;
  setResourceNeeds: (value: string) => void;
  results: string;
  setResults: (value: string) => void;
  
  // Files
  inputAttachments: File[];
  outputAttachments: File[];
  handleInputFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleOutputFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveInputFile: (index: number) => void;
  handleRemoveOutputFile: (index: number) => void;
  
  // Utils
  getFileIcon: (fileType: string) => React.ReactNode;
  formatFileSize: (bytes: number) => string;
  analysisToEdit?: CriticalAnalysisItem | null;
}

export function AnalysisFormContent({
  // General Info
  date,
  setDate,
  plannedDate,
  setPlannedDate,
  status,
  setStatus,
  subject,
  setSubject,
  participants,
  setParticipants,
  documents,
  setDocuments,
  
  // Requirements
  previousActionsStatus,
  setPreviousActionsStatus,
  externalInternalChanges,
  setExternalInternalChanges,
  performanceInfo,
  setPerformanceInfo,
  resourceSufficiency,
  setResourceSufficiency,
  riskActionsEffectiveness,
  setRiskActionsEffectiveness,
  improvementOpportunities,
  setImprovementOpportunities,
  
  // Results
  improvementResults,
  setImprovementResults,
  systemChangeNeeds,
  setSystemChangeNeeds,
  resourceNeeds,
  setResourceNeeds,
  results,
  setResults,
  
  // Files
  inputAttachments,
  outputAttachments,
  handleInputFileChange,
  handleOutputFileChange,
  handleRemoveInputFile,
  handleRemoveOutputFile,
  
  // Utils
  getFileIcon,
  formatFileSize,
  analysisToEdit = null
}: AnalysisFormContentProps) {
  return (
    <ScrollArea className="max-h-[70vh]">
      <div className="grid gap-4 py-4 pr-4">
        <GeneralInfoSection 
          date={date}
          setDate={setDate}
          plannedDate={plannedDate}
          setPlannedDate={setPlannedDate}
          status={status}
          setStatus={setStatus}
          subject={subject}
          setSubject={setSubject}
          participants={participants}
          setParticipants={setParticipants}
          documents={documents}
          setDocuments={setDocuments}
        />
        
        <InputRequirementsSection 
          previousActionsStatus={previousActionsStatus}
          setPreviousActionsStatus={setPreviousActionsStatus}
          externalInternalChanges={externalInternalChanges}
          setExternalInternalChanges={setExternalInternalChanges}
          performanceInfo={performanceInfo}
          setPerformanceInfo={setPerformanceInfo}
          resourceSufficiency={resourceSufficiency}
          setResourceSufficiency={setResourceSufficiency}
          riskActionsEffectiveness={riskActionsEffectiveness}
          setRiskActionsEffectiveness={setRiskActionsEffectiveness}
          improvementOpportunities={improvementOpportunities}
          setImprovementOpportunities={setImprovementOpportunities}
          inputAttachments={inputAttachments}
          handleInputFileChange={handleInputFileChange}
          handleRemoveInputFile={handleRemoveInputFile}
          getFileIcon={getFileIcon}
          formatFileSize={formatFileSize}
          analysisToEdit={analysisToEdit}
        />
        
        <ResultsSection 
          improvementResults={improvementResults}
          setImprovementResults={setImprovementResults}
          systemChangeNeeds={systemChangeNeeds}
          setSystemChangeNeeds={setSystemChangeNeeds}
          resourceNeeds={resourceNeeds}
          setResourceNeeds={setResourceNeeds}
          results={results}
          setResults={setResults}
          outputAttachments={outputAttachments}
          handleOutputFileChange={handleOutputFileChange}
          handleRemoveOutputFile={handleRemoveOutputFile}
          getFileIcon={getFileIcon}
          formatFileSize={formatFileSize}
          analysisToEdit={analysisToEdit}
        />
      </div>
    </ScrollArea>
  );
}
