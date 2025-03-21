
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, ChevronDown, ChevronUp, Download, FileText, Plus, Search, Trash, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Interface para anexos
interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  category: "input" | "output"; // Categoria do anexo: requisito de entrada ou resultado
}

// Tipos para a análise crítica
interface CriticalAnalysisItem {
  id: string;
  date: Date;
  subject: string;
  status: "planned" | "in-progress" | "completed";
  participants: string[];
  documents: string[];
  
  // Requisitos para entrada da análise crítica
  previousActionsStatus: string;
  externalInternalChanges: string;
  performanceInfo: string;
  resourceSufficiency: string;
  riskActionsEffectiveness: string;
  improvementOpportunities: string;
  
  // Resultados da análise crítica
  improvementResults: string;
  systemChangeNeeds: string;
  resourceNeeds: string;
  
  // Campo geral de resultados (manter para compatibilidade)
  results: string;
  
  // Nova propriedade para anexos
  attachments: Attachment[];
}

// Dados de exemplo atualizados com os novos campos
const mockAnalysis: CriticalAnalysisItem[] = [
  {
    id: "1",
    date: new Date(2023, 10, 15),
    subject: "Análise de Desempenho Q4 2023",
    status: "completed",
    participants: ["Diretor Geral", "Gerente da Qualidade", "Gerente de Produção"],
    documents: ["Indicadores Q4", "Relatório de Não Conformidades"],
    previousActionsStatus: "Todas as ações da análise anterior foram concluídas, com exceção da implementação do novo sistema de gestão documental.",
    externalInternalChanges: "Nova legislação ambiental afetando o setor. Mudança na estrutura organizacional com a criação do departamento de melhoria contínua.",
    performanceInfo: "Redução de 15% nas não conformidades. Melhoria de 8% nos indicadores de produtividade.",
    resourceSufficiency: "Recursos humanos na área de qualidade insuficientes para atender a crescente demanda.",
    riskActionsEffectiveness: "As ações para mitigar riscos de fornecimento mostraram-se eficazes, reduzindo atrasos em 60%.",
    improvementOpportunities: "Identificada oportunidade de melhoria no processo de inspeção final e no sistema de rastreabilidade.",
    improvementResults: "Implementar sistema automatizado de inspeção final. Revisar processo de rastreabilidade.",
    systemChangeNeeds: "Atualização do manual da qualidade para refletir a nova estrutura organizacional.",
    resourceNeeds: "Contratação de um analista de qualidade adicional. Investimento em software de gestão documental.",
    results: "Metas atingidas em 80%. Necessidade de melhorias no processo de inspeção final.",
    attachments: [
      {
        id: "att-1",
        name: "relatorio-indicadores-q4.pdf",
        type: "application/pdf",
        size: 1500000,
        category: "input"
      },
      {
        id: "att-2",
        name: "apresentacao-analise.pptx",
        type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        size: 2500000,
        category: "output"
      }
    ]
  },
  {
    id: "2",
    date: new Date(2024, 1, 20),
    subject: "Revisão da Política da Qualidade",
    status: "completed",
    participants: ["Diretor Geral", "Gerente da Qualidade", "RH"],
    documents: ["Política da Qualidade", "Objetivos Estratégicos"],
    previousActionsStatus: "Implementação do sistema de gestão documental concluída. Pendente revisão dos procedimentos operacionais.",
    externalInternalChanges: "Novas exigências de clientes relacionadas à sustentabilidade. Mudança na direção de operações.",
    performanceInfo: "Objetivos da qualidade atingidos em 85%. Aumento de 12% nas vendas para clientes com requisitos específicos de qualidade.",
    resourceSufficiency: "Recursos financeiros para treinamentos abaixo do planejado.",
    riskActionsEffectiveness: "Plano de contingência para interrupções de fornecimento testado com sucesso.",
    improvementOpportunities: "Oportunidade para melhorar a comunicação interna sobre requisitos de qualidade.",
    improvementResults: "Implementar programa de comunicação interna. Revisar treinamentos introdutórios.",
    systemChangeNeeds: "Inclusão de requisitos de sustentabilidade na política da qualidade.",
    resourceNeeds: "Aumento de orçamento para treinamentos em 10%.",
    results: "Política atualizada com novos objetivos de sustentabilidade.",
    attachments: [
      {
        id: "att-3",
        name: "politica-qualidade-revisada.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 850000,
        category: "input"
      }
    ]
  },
  {
    id: "3",
    date: new Date(2024, 3, 10),
    subject: "Análise de Eficácia das Ações Corretivas",
    status: "in-progress",
    participants: ["Gerente da Qualidade", "Líderes de Setor"],
    documents: ["Relatório de Ações Corretivas", "Indicadores de Reincidência"],
    previousActionsStatus: "70% das ações da revisão da política da qualidade implementadas.",
    externalInternalChanges: "Mudanças nos requisitos de certificação ISO. Implementação de novo ERP.",
    performanceInfo: "Taxa de reincidência de não conformidades reduzida em 25%.",
    resourceSufficiency: "Recursos de TI adequados, mas com necessidade de treinamento adicional.",
    riskActionsEffectiveness: "Eficácia das ações para riscos de qualidade em avaliação.",
    improvementOpportunities: "Melhoria na análise de causa raiz das não conformidades.",
    improvementResults: "Em análise",
    systemChangeNeeds: "Em análise",
    resourceNeeds: "Em análise",
    results: "Em andamento",
    attachments: [
      {
        id: "att-4",
        name: "relatorio-acoes-corretivas.xlsx",
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: 1200000,
        category: "input"
      }
    ]
  },
  {
    id: "4",
    date: new Date(2024, 6, 5),
    subject: "Planejamento de Auditoria Interna",
    status: "planned",
    participants: ["Auditores Internos", "Gerente da Qualidade"],
    documents: ["Cronograma de Auditoria", "Checklist ISO 9001"],
    previousActionsStatus: "A ser avaliado",
    externalInternalChanges: "A ser avaliado",
    performanceInfo: "A ser avaliado",
    resourceSufficiency: "A ser avaliado",
    riskActionsEffectiveness: "A ser avaliado",
    improvementOpportunities: "A ser avaliado",
    improvementResults: "A ser definido",
    systemChangeNeeds: "A ser definido",
    resourceNeeds: "A ser definido",
    results: "Pendente",
    attachments: []
  }
];

export default function CriticalAnalysis() {
  const [analyses, setAnalyses] = useState<CriticalAnalysisItem[]>(mockAnalysis);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [subject, setSubject] = useState("");
  const [participants, setParticipants] = useState("");
  const [documents, setDocuments] = useState("");
  
  // Estados para requisitos de entrada
  const [previousActionsStatus, setPreviousActionsStatus] = useState("");
  const [externalInternalChanges, setExternalInternalChanges] = useState("");
  const [performanceInfo, setPerformanceInfo] = useState("");
  const [resourceSufficiency, setResourceSufficiency] = useState("");
  const [riskActionsEffectiveness, setRiskActionsEffectiveness] = useState("");
  const [improvementOpportunities, setImprovementOpportunities] = useState("");
  
  // Estados para resultados
  const [improvementResults, setImprovementResults] = useState("");
  const [systemChangeNeeds, setSystemChangeNeeds] = useState("");
  const [resourceNeeds, setResourceNeeds] = useState("");
  const [results, setResults] = useState("");

  // Estado para controlar expansão de detalhes
  const [expandedItems, setExpandedItems] = useState<{[key: string]: boolean}>({});
  
  // Estado para anexos
  const [inputAttachments, setInputAttachments] = useState<File[]>([]);
  const [outputAttachments, setOutputAttachments] = useState<File[]>([]);
  
  // Estado para dialog de anexos
  const [attachmentsDialogOpen, setAttachmentsDialogOpen] = useState(false);
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const handleAttachmentClick = (analysisId: string) => {
    setCurrentAnalysisId(analysisId);
    setAttachmentsDialogOpen(true);
  };

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
    // Simulação de upload - em uma implementação real, isso enviaria arquivos para o Supabase Storage
    return files.map((file, index) => ({
      id: `new-att-${Date.now()}-${index}`,
      name: file.name,
      type: file.type,
      size: file.size,
      category
    }));
  };

  const handleSave = async () => {
    try {
      // Upload de arquivos
      const inputAttachmentsList = await uploadFiles(inputAttachments, "input");
      const outputAttachmentsList = await uploadFiles(outputAttachments, "output");
      
      const newAnalysis: CriticalAnalysisItem = {
        id: Date.now().toString(),
        date: date || new Date(),
        subject,
        status: "planned",
        participants: participants.split(',').map(p => p.trim()),
        documents: documents.split(',').map(d => d.trim()),
        
        // Requisitos de entrada
        previousActionsStatus,
        externalInternalChanges,
        performanceInfo,
        resourceSufficiency,
        riskActionsEffectiveness,
        improvementOpportunities,
        
        // Resultados
        improvementResults,
        systemChangeNeeds,
        resourceNeeds,
        
        // Campo geral de resultados
        results,
        
        // Anexos
        attachments: [...inputAttachmentsList, ...outputAttachmentsList]
      };

      setAnalyses([...analyses, newAnalysis]);
      setOpen(false);
      toast.success("Análise crítica criada com sucesso!");
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar análise crítica:", error);
      toast.error("Erro ao criar análise crítica. Tente novamente.");
    }
  };
  
  const handleAddAttachment = async () => {
    if (!currentAnalysisId) return;
    
    try {
      // Upload de anexos
      const inputAttachmentsList = await uploadFiles(inputAttachments, "input");
      const outputAttachmentsList = await uploadFiles(outputAttachments, "output");
      
      // Atualiza a análise com os novos anexos
      setAnalyses(prev => prev.map(analysis => {
        if (analysis.id === currentAnalysisId) {
          return {
            ...analysis,
            attachments: [
              ...analysis.attachments,
              ...inputAttachmentsList,
              ...outputAttachmentsList
            ]
          };
        }
        return analysis;
      }));
      
      setAttachmentsDialogOpen(false);
      setCurrentAnalysisId(null);
      setInputAttachments([]);
      setOutputAttachments([]);
      toast.success("Anexos adicionados com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar anexos:", error);
      toast.error("Erro ao adicionar anexos. Tente novamente.");
    }
  };
  
  const handleDeleteAttachment = (analysisId: string, attachmentId: string) => {
    setAnalyses(prev => prev.map(analysis => {
      if (analysis.id === analysisId) {
        return {
          ...analysis,
          attachments: analysis.attachments.filter(att => att.id !== attachmentId)
        };
      }
      return analysis;
    }));
    
    toast.success("Anexo removido com sucesso!");
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planned":
        return "text-yellow-500";
      case "in-progress":
        return "text-blue-500";
      case "completed":
        return "text-green-500";
      default:
        return "";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "planned":
        return "Planejada";
      case "in-progress":
        return "Em Andamento";
      case "completed":
        return "Concluída";
      default:
        return status;
    }
  };
  
  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) {
      return <FileText className="text-red-500" size={16} />;
    } else if (fileType.includes("spreadsheet") || fileType.includes("excel") || fileType.includes("xlsx")) {
      return <FileText className="text-green-500" size={16} />;
    } else if (fileType.includes("document") || fileType.includes("word") || fileType.includes("docx")) {
      return <FileText className="text-blue-500" size={16} />;
    } else if (fileType.includes("presentation") || fileType.includes("powerpoint") || fileType.includes("pptx")) {
      return <FileText className="text-orange-500" size={16} />;
    } else {
      return <FileText className="text-gray-500" size={16} />;
    }
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) {
      return bytes + ' bytes';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Navigation />
      
      <main className="flex-1 p-6 md:p-8 ml-0 md:ml-64">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Análise Crítica</h1>
              <p className="text-muted-foreground mt-1">
                Execução e acompanhamento das reuniões de análise crítica pela direção
              </p>
            </div>
            
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
                
                <div className="grid gap-4 py-4">
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
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                  <Button onClick={handleSave}>Salvar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </header>
        
        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="planned">Planejadas</TabsTrigger>
            <TabsTrigger value="in-progress">Em Andamento</TabsTrigger>
            <TabsTrigger value="completed">Concluídas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>Todas as Análises Críticas</CardTitle>
                <CardDescription>
                  Visualize todas as reuniões de análise crítica pela direção
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Buscar análises críticas..."
                      className="pl-8"
                    />
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Assunto</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Participantes</TableHead>
                      <TableHead>Anexos</TableHead>
                      <TableHead>Detalhes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyses.map((analysis) => (
                      <React.Fragment key={analysis.id}>
                        <TableRow>
                          <TableCell>{format(analysis.date, "dd/MM/yyyy")}</TableCell>
                          <TableCell className="font-medium">{analysis.subject}</TableCell>
                          <TableCell className={getStatusColor(analysis.status)}>
                            {getStatusText(analysis.status)}
                          </TableCell>
                          <TableCell>{analysis.participants.join(", ")}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{analysis.attachments.length}</span>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleAttachmentClick(analysis.id)}
                              >
                                <Upload size={14} className="mr-1" />
                                Gerenciar
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => toggleExpand(analysis.id)}
                            >
                              {expandedItems[analysis.id] ? (
                                <ChevronUp size={16} />
                              ) : (
                                <ChevronDown size={16} />
                              )}
                              {expandedItems[analysis.id] ? "Ocultar" : "Mostrar"}
                            </Button>
                          </TableCell>
                        </TableRow>
                        
                        {expandedItems[analysis.id] && (
                          <TableRow className="bg-muted/30">
                            <TableCell colSpan={6} className="p-4">
                              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                  <h3 className="font-medium text-base mb-3">Requisitos para entrada da análise crítica</h3>
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="text-sm font-medium">Situação de ações anteriores:</h4>
                                      <p className="text-sm text-muted-foreground mt-1">{analysis.previousActionsStatus}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium">Mudanças externas e internas:</h4>
                                      <p className="text-sm text-muted-foreground mt-1">{analysis.externalInternalChanges}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium">Desempenho e eficácia do SGQ:</h4>
                                      <p className="text-sm text-muted-foreground mt-1">{analysis.performanceInfo}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium">Suficiência de recursos:</h4>
                                      <p className="text-sm text-muted-foreground mt-1">{analysis.resourceSufficiency}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium">Eficácia de ações para riscos:</h4>
                                      <p className="text-sm text-muted-foreground mt-1">{analysis.riskActionsEffectiveness}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium">Oportunidades de melhoria:</h4>
                                      <p className="text-sm text-muted-foreground mt-1">{analysis.improvementOpportunities}</p>
                                    </div>
                                    
                                    {analysis.attachments.filter(att => att.category === "input").length > 0 && (
                                      <div className="mt-4">
                                        <h4 className="text-sm font-medium">Anexos de requisitos:</h4>
                                        <div className="mt-2 space-y-2">
                                          {analysis.attachments
                                            .filter(att => att.category === "input")
                                            .map((attachment) => (
                                              <div key={attachment.id} className="flex items-center justify-between bg-muted p-2 rounded">
                                                <div className="flex items-center">
                                                  {getFileIcon(attachment.type)}
                                                  <span className="ml-2 text-sm">{attachment.name}</span>
                                                  <span className="ml-2 text-xs text-muted-foreground">
                                                    ({formatFileSize(attachment.size)})
                                                  </span>
                                                </div>
                                                <div className="flex">
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {}}
                                                  >
                                                    <Download size={14} />
                                                  </Button>
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteAttachment(analysis.id, attachment.id)}
                                                  >
                                                    <Trash size={14} />
                                                  </Button>
                                                </div>
                                              </div>
                                            ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div>
                                  <h3 className="font-medium text-base mb-3">Resultados da análise crítica</h3>
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="text-sm font-medium">Oportunidades para melhoria:</h4>
                                      <p className="text-sm text-muted-foreground mt-1">{analysis.improvementResults}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium">Necessidades de mudança no SGQ:</h4>
                                      <p className="text-sm text-muted-foreground mt-1">{analysis.systemChangeNeeds}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium">Necessidade de recursos:</h4>
                                      <p className="text-sm text-muted-foreground mt-1">{analysis.resourceNeeds}</p>
                                    </div>
                                    
                                    <div className="pt-2 border-t">
                                      <h4 className="text-sm font-medium">Documentos relacionados:</h4>
                                      <p className="text-sm text-muted-foreground mt-1">{analysis.documents.join(", ")}</p>
                                    </div>
                                    
                                    {analysis.status !== "planned" && (
                                      <div>
                                        <h4 className="text-sm font-medium">Resultados gerais:</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{analysis.results}</p>
                                      </div>
                                    )}
                                    
                                    {analysis.attachments.filter(att => att.category === "output").length > 0 && (
                                      <div className="mt-4">
                                        <h4 className="text-sm font-medium">Anexos de resultados:</h4>
                                        <div className="mt-2 space-y-2">
                                          {analysis.attachments
                                            .filter(att => att.category === "output")
                                            .map((attachment) => (
                                              <div key={attachment.id} className="flex items-center justify-between bg-muted p-2 rounded">
                                                <div className="flex items-center">
                                                  {getFileIcon(attachment.type)}
                                                  <span className="ml-2 text-sm">{attachment.name}</span>
                                                  <span className="ml-2 text-xs text-muted-foreground">
                                                    ({formatFileSize(attachment.size)})
                                                  </span>
                                                </div>
                                                <div className="flex">
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {}}
                                                  >
                                                    <Download size={14} />
                                                  </Button>
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteAttachment(analysis.id, attachment.id)}
                                                  >
                                                    <Trash size={14} />
                                                  </Button>
                                                </div>
                                              </div>
                                            ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="planned">
            <Card>
              <CardHeader>
                <CardTitle>Análises Críticas Planejadas</CardTitle>
                <CardDescription>
                  Próximas reuniões de análise crítica agendadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Assunto</TableHead>
                      <TableHead>Participantes</TableHead>
                      <TableHead>Documentos</TableHead>
                      <TableHead>Anexos</TableHead>
                      <TableHead>Detalhes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyses
                      .filter((a) => a.status === "planned")
                      .map((analysis) => (
                        <React.Fragment key={analysis.id}>
                          <TableRow>
                            <TableCell>{format(analysis.date, "dd/MM/yyyy")}</TableCell>
                            <TableCell className="font-medium">{analysis.subject}</TableCell>
                            <TableCell>{analysis.participants.join(", ")}</TableCell>
                            <TableCell>{analysis.documents.join(", ")}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span>{analysis.attachments.length}</span>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleAttachmentClick(analysis.id)}
                                >
                                  <Upload size={14} className="mr-1" />
                                  Gerenciar
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => toggleExpand(analysis.id)}
                              >
                                {expandedItems[analysis.id] ? (
                                  <ChevronUp size={16} />
                                ) : (
                                  <ChevronDown size={16} />
                                )}
                                {expandedItems[analysis.id] ? "Ocultar" : "Mostrar"}
                              </Button>
                            </TableCell>
                          </TableRow>
                          
                          {expandedItems[analysis.id] && (
                            <TableRow className="bg-muted/30">
                              <TableCell colSpan={6} className="p-4">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                  <div>
                                    <h3 className="font-medium text-base mb-3">Requisitos para entrada da análise crítica</h3>
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="text-sm font-medium">Situação de ações anteriores:</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{analysis.previousActionsStatus}</p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium">Mudanças externas e internas:</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{analysis.externalInternalChanges}</p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium">Tópicos a serem avaliados:</h4>
                                        <div className="space-y-2 mt-1">
                                          <div className="flex items-center space-x-2">
                                            <Checkbox id={`performance-${analysis.id}`} />
                                            <label
                                              htmlFor={`performance-${analysis.id}`}
                                              className="text-sm font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                              Desempenho e eficácia do SGQ
                                            </label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Checkbox id={`resources-${analysis.id}`} />
                                            <label
                                              htmlFor={`resources-${analysis.id}`}
                                              className="text-sm font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                              Suficiência de recursos
                                            </label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Checkbox id={`risks-${analysis.id}`} />
                                            <label
                                              htmlFor={`risks-${analysis.id}`}
                                              className="text-sm font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                              Eficácia de ações para riscos
                                            </label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Checkbox id={`improvement-${analysis.id}`} />
                                            <label
                                              htmlFor={`improvement-${analysis.id}`}
                                              className="text-sm font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                              Oportunidades de melhoria
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {analysis.attachments.filter(att => att.category === "input").length > 0 && (
                                        <div className="mt-4">
                                          <h4 className="text-sm font-medium">Anexos de requisitos:</h4>
                                          <div className="mt-2 space-y-2">
                                            {analysis.attachments
                                              .filter(att => att.category === "input")
                                              .map((attachment) => (
                                                <div key={attachment.id} className="flex items-center justify-between bg-muted p-2 rounded">
                                                  <div className="flex items-center">
                                                    {getFileIcon(attachment.type)}
                                                    <span className="ml-2 text-sm">{attachment.name}</span>
                                                    <span className="ml-2 text-xs text-muted-foreground">
                                                      ({formatFileSize(attachment.size)})
                                                    </span>
                                                  </div>
                                                  <div className="flex">
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => {}}
                                                    >
                                                      <Download size={14} />
                                                    </Button>
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => handleDeleteAttachment(analysis.id, attachment.id)}
                                                    >
                                                      <Trash size={14} />
                                                    </Button>
                                                  </div>
                                                </div>
                                              ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h3 className="font-medium text-base mb-3">Resultados esperados</h3>
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="text-sm font-medium">Oportunidades para melhoria:</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{analysis.improvementResults || "A ser definido"}</p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium">Necessidades de mudança no SGQ:</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{analysis.systemChangeNeeds || "A ser definido"}</p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium">Necessidade de recursos:</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{analysis.resourceNeeds || "A ser definido"}</p>
                                      </div>
                                      
                                      {analysis.attachments.filter(att => att.category === "output").length > 0 && (
                                        <div className="mt-4">
                                          <h4 className="text-sm font-medium">Anexos de resultados:</h4>
                                          <div className="mt-2 space-y-2">
                                            {analysis.attachments
                                              .filter(att => att.category === "output")
                                              .map((attachment) => (
                                                <div key={attachment.id} className="flex items-center justify-between bg-muted p-2 rounded">
                                                  <div className="flex items-center">
                                                    {getFileIcon(attachment.type)}
                                                    <span className="ml-2 text-sm">{attachment.name}</span>
                                                    <span className="ml-2 text-xs text-muted-foreground">
                                                      ({formatFileSize(attachment.size)})
                                                    </span>
                                                  </div>
                                                  <div className="flex">
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => {}}
                                                    >
                                                      <Download size={14} />
                                                    </Button>
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => handleDeleteAttachment(analysis.id, attachment.id)}
                                                    >
                                                      <Trash size={14} />
                                                    </Button>
                                                  </div>
                                                </div>
                                              ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="in-progress">
            <Card>
              <CardHeader>
                <CardTitle>Análises Críticas em Andamento</CardTitle>
                <CardDescription>
                  Reuniões de análise crítica que estão em curso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Assunto</TableHead>
                      <TableHead>Participantes</TableHead>
                      <TableHead>Documentos</TableHead>
                      <TableHead>Detalhes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyses
                      .filter((a) => a.status === "in-progress")
                      .map((analysis) => (
                        <>
                          <TableRow key={analysis.id}>
                            <TableCell>{format(analysis.date, "dd/MM/yyyy")}</TableCell>
                            <TableCell className="font-medium">{analysis.subject}</TableCell>
                            <TableCell>{analysis.participants.join(", ")}</TableCell>
                            <TableCell>{analysis.documents.join(", ")}</TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => toggleExpand(analysis.id)}
                              >
                                {expandedItems[analysis.id] ? (
                                  <ChevronUp size={16} />
                                ) : (
                                  <ChevronDown size={16} />
                                )}
                                {expandedItems[analysis.id] ? "Ocultar" : "Mostrar"}
                              </Button>
                            </TableCell>
                          </TableRow>
                          
                          {expandedItems[analysis.id] && (
                            <TableRow className="bg-muted/30">
                              <TableCell colSpan={5} className="p-4">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                  <div>
                                    <h3 className="font-medium text-base mb-3">Requisitos para entrada da análise crítica</h3>
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="text-sm font-medium">Situação de ações anteriores:</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{analysis.previousActionsStatus}</p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium">Mudanças externas e internas:</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{analysis.externalInternalChanges}</p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium">Desempenho e eficácia do SGQ:</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{analysis.performanceInfo}</p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium">Suficiência de recursos:</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{analysis.resourceSufficiency}</p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium">Eficácia de ações para riscos:</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{analysis.riskActionsEffectiveness}</p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium">Oportunidades de melhoria:</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{analysis.improvementOpportunities}</p>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h3 className="font-medium text-base mb-3">Resultados parciais da análise crítica</h3>
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="text-sm font-medium">Status atual:</h4>
                                        <p className="text-sm text-muted-foreground mt-1">Em andamento - resultados parciais disponíveis</p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium">Oportunidades para melhoria (parcial):</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{analysis.improvementResults}</p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium">Necessidades de mudança (parcial):</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{analysis.systemChangeNeeds}</p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium">Necessidade de recursos (parcial):</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{analysis.resourceNeeds}</p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium">Resultados parciais:</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{analysis.results}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Análises Críticas Concluídas</CardTitle>
                <CardDescription>
                  Histórico de reuniões de análise crítica finalizadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Assunto</TableHead>
                      <TableHead>Participantes</TableHead>
                      <TableHead>Documentos</TableHead>
                      <TableHead>Detalhes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyses
                      .filter((a) => a.status === "completed")
                      .map((analysis) => (
                        <>
                          <TableRow key={analysis.id}>
                            <TableCell>{format(analysis.date, "dd/MM/yyyy")}</TableCell>
                            <TableCell className="font-medium">{analysis.subject}</TableCell>
                            <TableCell>{analysis.participants.join(", ")}</TableCell>
                            <TableCell>{analysis.documents.join(", ")}</TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => toggleExpand(analysis.id)}
                              >
                                {expandedItems[analysis.id] ? (
                                  <ChevronUp size={16} />
                                ) : (
                                  <ChevronDown size={16} />
                                )}
                                {expandedItems[analysis.id] ? "Ocultar" : "Mostrar"}
                              </Button>
                            </TableCell>
                          </TableRow>
                          
                          {expandedItems[analysis.id] && (
                            <TableRow className="bg-muted/30">
                              <TableCell colSpan={5} className="p-4">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                  <div>
                                    <h3 className="font-medium text-base mb-3">Requisitos para entrada da análise crítica</h3>
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="text-sm font-medium">Situação de ações anteriores:</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{analysis.previousActionsStatus}</p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium">Mudanças externas e internas:</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{analysis.externalInternalChanges}</p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium">Desempenho e eficácia do SGQ:</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{analysis.performanceInfo}</p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium">Suficiência de recursos:</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{analysis.resourceSufficiency}</p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium">Eficácia de ações para riscos:</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{analysis.riskActionsEffectiveness}</p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium">Oportunidades de melhoria:</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{analysis.improvementOpportunities}</p>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h3 className="font-medium text-base mb-3">Resultados da análise crítica</h3>
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="text-sm font-medium">Oportunidades para melhoria:</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{analysis.improvementResults}</p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium">Necessidades de mudança no SGQ:</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{analysis.systemChangeNeeds}</p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium">Necessidade de recursos:</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{analysis.resourceNeeds}</p>
                                      </div>
                                      <div className="pt-3 border-t mt-3">
                                        <h4 className="text-sm font-medium">Resultados finais:</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{analysis.results}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Dialog para gerenciar anexos */}
        <Dialog open={attachmentsDialogOpen} onOpenChange={setAttachmentsDialogOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Gerenciar Anexos</DialogTitle>
              <DialogDescription>
                Adicione ou remova anexos para evidenciar os requisitos de entrada e resultados da análise crítica.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Anexos para Requisitos de Entrada:</h3>
              </div>
              
              <div>
                <Input
                  id="addInputAttachments"
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
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Anexos para Resultados:</h3>
              </div>
              
              <div>
                <Input
                  id="addOutputAttachments"
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
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Anexos Existentes:</h3>
              </div>
              
              {currentAnalysisId && (
                <div className="space-y-2">
                  {analyses
                    .find(a => a.id === currentAnalysisId)?.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between bg-muted p-2 rounded">
                        <div className="flex items-center">
                          {getFileIcon(attachment.type)}
                          <span className="ml-2 text-sm">{attachment.name}</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({formatFileSize(attachment.size)})
                          </span>
                          <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            {attachment.category === "input" ? "Requisito" : "Resultado"}
                          </span>
                        </div>
                        <div className="flex">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {}}
                          >
                            <Download size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAttachment(currentAnalysisId, attachment.id)}
                          >
                            <Trash size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setAttachmentsDialogOpen(false);
                setInputAttachments([]);
                setOutputAttachments([]);
              }}>Cancelar</Button>
              <Button onClick={handleAddAttachment}>Adicionar Anexos</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
