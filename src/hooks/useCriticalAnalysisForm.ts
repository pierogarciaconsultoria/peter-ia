
import { useState } from "react";
import { CriticalAnalysisItem, Attachment } from "@/types/critical-analysis";
import { toast } from "sonner";

export interface CriticalAnalysisFormState {
  date: Date | undefined;
  subject: string;
  participants: string;
  documents: string;
  status: "planned" | "in-progress" | "completed";
  plannedDate: Date | undefined;
  
  // Requisitos
  previousActionsStatus: string;
  externalInternalChanges: string;
  performanceInfo: string;
  resourceSufficiency: string;
  riskActionsEffectiveness: string;
  improvementOpportunities: string;
  
  // Resultados
  improvementResults: string;
  systemChangeNeeds: string;
  resourceNeeds: string;
  results: string;
  
  // Anexos
  inputAttachments: File[];
  outputAttachments: File[];
}

export function useCriticalAnalysisForm(
  analysisToEdit: CriticalAnalysisItem | null = null,
  onAddAnalysis: (analysis: CriticalAnalysisItem) => void,
  setOpen: (open: boolean) => void
) {
  // Form state
  const [date, setDate] = useState<Date | undefined>(analysisToEdit ? analysisToEdit.date : new Date());
  const [subject, setSubject] = useState(analysisToEdit ? analysisToEdit.subject : "");
  const [participants, setParticipants] = useState(analysisToEdit ? analysisToEdit.participants.join(", ") : "");
  const [documents, setDocuments] = useState(analysisToEdit ? analysisToEdit.documents.join(", ") : "");
  const [status, setStatus] = useState<"planned" | "in-progress" | "completed">(analysisToEdit ? analysisToEdit.status : "planned");
  const [plannedDate, setPlannedDate] = useState<Date | undefined>(analysisToEdit?.plannedDate);
  
  const [previousActionsStatus, setPreviousActionsStatus] = useState(analysisToEdit ? analysisToEdit.previousActionsStatus : "");
  const [externalInternalChanges, setExternalInternalChanges] = useState(analysisToEdit ? analysisToEdit.externalInternalChanges : "");
  const [performanceInfo, setPerformanceInfo] = useState(analysisToEdit ? analysisToEdit.performanceInfo : "");
  const [resourceSufficiency, setResourceSufficiency] = useState(analysisToEdit ? analysisToEdit.resourceSufficiency : "");
  const [riskActionsEffectiveness, setRiskActionsEffectiveness] = useState(analysisToEdit ? analysisToEdit.riskActionsEffectiveness : "");
  const [improvementOpportunities, setImprovementOpportunities] = useState(analysisToEdit ? analysisToEdit.improvementOpportunities : "");
  
  const [improvementResults, setImprovementResults] = useState(analysisToEdit ? analysisToEdit.improvementResults : "");
  const [systemChangeNeeds, setSystemChangeNeeds] = useState(analysisToEdit ? analysisToEdit.systemChangeNeeds : "");
  const [resourceNeeds, setResourceNeeds] = useState(analysisToEdit ? analysisToEdit.resourceNeeds : "");
  const [results, setResults] = useState(analysisToEdit ? analysisToEdit.results : "");
  
  const [inputAttachments, setInputAttachments] = useState<File[]>([]);
  const [outputAttachments, setOutputAttachments] = useState<File[]>([]);
  
  const isEditing = !!analysisToEdit;
  
  // File handlers
  const handleInputFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setInputAttachments(prev => [...prev, ...newFiles]);
    }
  };
  
  const handleOutputFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setOutputAttachments(prev => [...prev, ...newFiles]);
    }
  };
  
  const handleRemoveInputFile = (index: number) => {
    setInputAttachments(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleRemoveOutputFile = (index: number) => {
    setOutputAttachments(prev => prev.filter((_, i) => i !== index));
  };
  
  // File upload simulation
  const uploadFiles = async (files: File[], category: "input" | "output"): Promise<Attachment[]> => {
    return files.map((file, index) => ({
      id: `new-att-${Date.now()}-${index}`,
      name: file.name,
      type: file.type,
      size: file.size,
      category
    }));
  };
  
  // Form reset
  const resetForm = () => {
    setDate(new Date());
    setSubject("");
    setParticipants("");
    setDocuments("");
    setStatus("planned");
    setPlannedDate(undefined);
    setPreviousActionsStatus("");
    setExternalInternalChanges("");
    setPerformanceInfo("");
    setResourceSufficiency("");
    setRiskActionsEffectiveness("");
    setImprovementOpportunities("");
    setImprovementResults("");
    setSystemChangeNeeds("");
    setResourceNeeds("");
    setResults("");
    setInputAttachments([]);
    setOutputAttachments([]);
  };
  
  // Form save
  const handleSave = async () => {
    try {
      const inputAttachmentsList = await uploadFiles(inputAttachments, "input");
      const outputAttachmentsList = await uploadFiles(outputAttachments, "output");
      
      const newAnalysis: CriticalAnalysisItem = {
        id: analysisToEdit ? analysisToEdit.id : Date.now().toString(),
        date: date || new Date(),
        subject,
        status,
        plannedDate,
        participants: participants.split(',').map(p => p.trim()),
        documents: documents.split(',').map(d => d.trim()),
        
        previousActionsStatus,
        externalInternalChanges,
        performanceInfo,
        resourceSufficiency,
        riskActionsEffectiveness,
        improvementOpportunities,
        
        improvementResults,
        systemChangeNeeds,
        resourceNeeds,
        
        results,
        
        attachments: [...(analysisToEdit ? analysisToEdit.attachments : []), ...inputAttachmentsList, ...outputAttachmentsList]
      };
  
      onAddAnalysis(newAnalysis);
      setOpen(false);
      toast.success(isEditing ? "Análise crítica atualizada com sucesso!" : "Análise crítica criada com sucesso!");
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar análise crítica:", error);
      toast.error(isEditing ? "Erro ao atualizar análise crítica. Tente novamente." : "Erro ao criar análise crítica. Tente novamente.");
    }
  };
  
  return {
    formState: {
      date,
      subject,
      participants,
      documents,
      status,
      plannedDate,
      previousActionsStatus,
      externalInternalChanges,
      performanceInfo,
      resourceSufficiency,
      riskActionsEffectiveness,
      improvementOpportunities,
      improvementResults,
      systemChangeNeeds,
      resourceNeeds,
      results,
      inputAttachments,
      outputAttachments
    },
    setters: {
      setDate,
      setSubject,
      setParticipants,
      setDocuments,
      setStatus,
      setPlannedDate,
      setPreviousActionsStatus,
      setExternalInternalChanges,
      setPerformanceInfo,
      setResourceSufficiency,
      setRiskActionsEffectiveness,
      setImprovementOpportunities,
      setImprovementResults,
      setSystemChangeNeeds,
      setResourceNeeds,
      setResults
    },
    fileHandlers: {
      handleInputFileChange,
      handleOutputFileChange,
      handleRemoveInputFile,
      handleRemoveOutputFile
    },
    isEditing,
    handleSave
  };
}
