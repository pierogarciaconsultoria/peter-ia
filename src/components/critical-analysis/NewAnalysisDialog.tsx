
import React from "react";
import { Plus } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CriticalAnalysisItem } from "@/types/critical-analysis";
import { useCriticalAnalysisForm } from "@/hooks/useCriticalAnalysisForm";
import { AnalysisFormContent } from "./form/AnalysisFormContent";

interface NewAnalysisDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAddAnalysis: (analysis: CriticalAnalysisItem) => void;
  getFileIcon: (fileType: string) => React.ReactNode;
  formatFileSize: (bytes: number) => string;
  analysisToEdit?: CriticalAnalysisItem | null;
}

export function NewAnalysisDialog({ 
  open, 
  setOpen, 
  onAddAnalysis,
  getFileIcon,
  formatFileSize,
  analysisToEdit = null
}: NewAnalysisDialogProps) {
  const { 
    formState,
    setters,
    fileHandlers,
    isEditing,
    handleSave
  } = useCriticalAnalysisForm(analysisToEdit, onAddAnalysis, setOpen);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus size={16} className="mr-2" />
          Nova Análise Crítica
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Análise Crítica" : "Nova Análise Crítica"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Edite os detalhes da análise crítica existente." : "Registre uma nova reunião de análise crítica pela direção."}
          </DialogDescription>
        </DialogHeader>
        
        <AnalysisFormContent 
          // General info
          date={formState.date}
          setDate={setters.setDate}
          plannedDate={formState.plannedDate}
          setPlannedDate={setters.setPlannedDate}
          status={formState.status}
          setStatus={setters.setStatus}
          subject={formState.subject}
          setSubject={setters.setSubject}
          participants={formState.participants}
          setParticipants={setters.setParticipants}
          documents={formState.documents}
          setDocuments={setters.setDocuments}
          
          // Requirements
          previousActionsStatus={formState.previousActionsStatus}
          setPreviousActionsStatus={setters.setPreviousActionsStatus}
          externalInternalChanges={formState.externalInternalChanges}
          setExternalInternalChanges={setters.setExternalInternalChanges}
          performanceInfo={formState.performanceInfo}
          setPerformanceInfo={setters.setPerformanceInfo}
          resourceSufficiency={formState.resourceSufficiency}
          setResourceSufficiency={setters.setResourceSufficiency}
          riskActionsEffectiveness={formState.riskActionsEffectiveness}
          setRiskActionsEffectiveness={setters.setRiskActionsEffectiveness}
          improvementOpportunities={formState.improvementOpportunities}
          setImprovementOpportunities={setters.setImprovementOpportunities}
          
          // Results
          improvementResults={formState.improvementResults}
          setImprovementResults={setters.setImprovementResults}
          systemChangeNeeds={formState.systemChangeNeeds}
          setSystemChangeNeeds={setters.setSystemChangeNeeds}
          resourceNeeds={formState.resourceNeeds}
          setResourceNeeds={setters.setResourceNeeds}
          results={formState.results}
          setResults={setters.setResults}
          
          // Files
          inputAttachments={formState.inputAttachments}
          outputAttachments={formState.outputAttachments}
          handleInputFileChange={fileHandlers.handleInputFileChange}
          handleOutputFileChange={fileHandlers.handleOutputFileChange}
          handleRemoveInputFile={fileHandlers.handleRemoveInputFile}
          handleRemoveOutputFile={fileHandlers.handleRemoveOutputFile}
          
          // Utils
          getFileIcon={getFileIcon}
          formatFileSize={formatFileSize}
          analysisToEdit={analysisToEdit}
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave}>{isEditing ? "Atualizar" : "Salvar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
