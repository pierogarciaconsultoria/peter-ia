
import React, { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash, CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CriticalAnalysisItem, Attachment } from "@/types/critical-analysis";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NewAnalysisDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAddAnalysis: (analysis: CriticalAnalysisItem) => void;
  getFileIcon: (fileType: string) => React.ReactNode;
  formatFileSize: (bytes: number) => string;
}

export function NewAnalysisDialog({ 
  open, 
  setOpen, 
  onAddAnalysis,
  getFileIcon,
  formatFileSize
}: NewAnalysisDialogProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [subject, setSubject] = useState("");
  const [participants, setParticipants] = useState("");
  const [documents, setDocuments] = useState("");
  
  const [previousActionsStatus, setPreviousActionsStatus] = useState("");
  const [externalInternalChanges, setExternalInternalChanges] = useState("");
  const [performanceInfo, setPerformanceInfo] = useState("");
  const [resourceSufficiency, setResourceSufficiency] = useState("");
  const [riskActionsEffectiveness, setRiskActionsEffectiveness] = useState("");
  const [improvementOpportunities, setImprovementOpportunities] = useState("");
  
  const [improvementResults, setImprovementResults] = useState("");
  const [systemChangeNeeds, setSystemChangeNeeds] = useState("");
  const [resourceNeeds, setResourceNeeds] = useState("");
  const [results, setResults] = useState("");

  const [inputAttachments, setInputAttachments] = useState<File[]>([]);
  const [outputAttachments, setOutputAttachments] = useState<File[]>([]);

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
  
  const uploadFiles = async (files: File[], category: "input" | "output"): Promise<Attachment[]> => {
    return files.map((file, index) => ({
      id: `new-att-${Date.now()}-${index}`,
      name: file.name,
      type: file.type,
      size: file.size,
      category
    }));
  };

  const resetForm = () => {
    setDate(new Date());
    setSubject("");
    setParticipants("");
    setDocuments("");
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

  const handleSave = async () => {
    try {
      const inputAttachmentsList = await uploadFiles(inputAttachments, "input");
      const outputAttachmentsList = await uploadFiles(outputAttachments, "output");
      
      const newAnalysis: CriticalAnalysisItem = {
        id: Date.now().toString(),
        date: date || new Date(),
        subject,
        status: "planned",
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
        
        attachments: [...inputAttachmentsList, ...outputAttachmentsList]
      };

      onAddAnalysis(newAnalysis);
      setOpen(false);
      toast.success("Análise crítica criada com sucesso!");
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar análise crítica:", error);
      toast.error("Erro ao criar análise crítica. Tente novamente.");
    }
  };

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
          <DialogTitle>Nova Análise Crítica</DialogTitle>
          <DialogDescription>
            Registre uma nova reunião de análise crítica pela direção.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh]">
          <div className="grid gap-4 py-4 pr-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Data
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                Assunto
              </Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="participants" className="text-right">
                Participantes
              </Label>
              <Input
                id="participants"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                className="col-span-3"
                placeholder="Separe por vírgulas"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="documents" className="text-right">
                Documentos
              </Label>
              <Input
                id="documents"
                value={documents}
                onChange={(e) => setDocuments(e.target.value)}
                className="col-span-3"
                placeholder="Separe por vírgulas"
              />
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Requisitos para entrada da análise crítica:</h3>
            </div>
          
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="previousActions" className="text-right pt-2">
                Situação de ações anteriores
              </Label>
              <Textarea
                id="previousActions"
                value={previousActionsStatus}
                onChange={(e) => setPreviousActionsStatus(e.target.value)}
                className="col-span-3"
                placeholder="Situação de ações provenientes de análises críticas anteriores pela direção"
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="changes" className="text-right pt-2">
                Mudanças externas e internas
              </Label>
              <Textarea
                id="changes"
                value={externalInternalChanges}
                onChange={(e) => setExternalInternalChanges(e.target.value)}
                className="col-span-3"
                placeholder="Mudanças em questões externas e internas que sejam pertinentes para o sistema de gestão da qualidade"
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="performance" className="text-right pt-2">
                Informações de desempenho
              </Label>
              <Textarea
                id="performance"
                value={performanceInfo}
                onChange={(e) => setPerformanceInfo(e.target.value)}
                className="col-span-3"
                placeholder="Informação sobre o desempenho e a eficácia do sistema de gestão da qualidade, incluindo tendências"
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="resources" className="text-right pt-2">
                Suficiência de recursos
              </Label>
              <Textarea
                id="resources"
                value={resourceSufficiency}
                onChange={(e) => setResourceSufficiency(e.target.value)}
                className="col-span-3"
                placeholder="Avaliação da suficiência de recursos para o sistema de gestão da qualidade"
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="riskActions" className="text-right pt-2">
                Eficácia de ações para riscos
              </Label>
              <Textarea
                id="riskActions"
                value={riskActionsEffectiveness}
                onChange={(e) => setRiskActionsEffectiveness(e.target.value)}
                className="col-span-3"
                placeholder="A eficácia de ações tomadas para abordar riscos e oportunidades"
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="opportunities" className="text-right pt-2">
                Oportunidades de melhoria
              </Label>
              <Textarea
                id="opportunities"
                value={improvementOpportunities}
                onChange={(e) => setImprovementOpportunities(e.target.value)}
                className="col-span-3"
                placeholder="Oportunidades de melhoria identificadas"
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="inputAttachments" className="text-right pt-2">
                Anexos de requisitos
              </Label>
              <div className="col-span-3">
                <Input
                  id="inputAttachments"
                  type="file"
                  multiple
                  onChange={handleInputFileChange}
                  className="w-full"
                />
                {inputAttachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {inputAttachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                        <div className="flex items-center">
                          {getFileIcon(file.type)}
                          <span className="ml-2 text-sm">{file.name}</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({formatFileSize(file.size)})
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveInputFile(index)}
                        >
                          <Trash size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Resultados da análise crítica:</h3>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="improvementResults" className="text-right pt-2">
                Oportunidades para melhoria
              </Label>
              <Textarea
                id="improvementResults"
                value={improvementResults}
                onChange={(e) => setImprovementResults(e.target.value)}
                className="col-span-3"
                placeholder="Oportunidades para melhoria identificadas e decididas"
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="systemChanges" className="text-right pt-2">
                Necessidades de mudança
              </Label>
              <Textarea
                id="systemChanges"
                value={systemChangeNeeds}
                onChange={(e) => setSystemChangeNeeds(e.target.value)}
                className="col-span-3"
                placeholder="Qualquer necessidade de mudança no sistema de gestão da qualidade"
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="resourceNeeds" className="text-right pt-2">
                Necessidade de recursos
              </Label>
              <Textarea
                id="resourceNeeds"
                value={resourceNeeds}
                onChange={(e) => setResourceNeeds(e.target.value)}
                className="col-span-3"
                placeholder="Recursos necessários identificados"
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="results" className="text-right pt-2">
                Resultados gerais
              </Label>
              <Textarea
                id="results"
                value={results}
                onChange={(e) => setResults(e.target.value)}
                className="col-span-3"
                placeholder="Resumo dos resultados gerais da análise crítica"
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="outputAttachments" className="text-right pt-2">
                Anexos de resultados
              </Label>
              <div className="col-span-3">
                <Input
                  id="outputAttachments"
                  type="file"
                  multiple
                  onChange={handleOutputFileChange}
                  className="w-full"
                />
                {outputAttachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {outputAttachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                        <div className="flex items-center">
                          {getFileIcon(file.type)}
                          <span className="ml-2 text-sm">{file.name}</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({formatFileSize(file.size)})
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveOutputFile(index)}
                        >
                          <Trash size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
