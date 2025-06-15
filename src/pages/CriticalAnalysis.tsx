import { useState } from "react";
import * as React from "react";
import { Navigation } from "@/components/Navigation";
import { Download, Plus, Trash, Edit } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CriticalAnalysisItem, Attachment } from "@/types/critical-analysis";
import { ReportDialog } from "@/components/critical-analysis/ReportDialog";
import { AnalysisStatusTabs } from "@/components/critical-analysis/AnalysisStatusTabs";
import { NewAnalysisDialog } from "@/components/critical-analysis/NewAnalysisDialog";
import { AttachmentsDialog } from "@/components/critical-analysis/AttachmentsDialog";
import { getFileIcon, formatFileSize, getStatusColor, getStatusText } from "@/components/critical-analysis/utils/file-utils";

const mockAnalysis: CriticalAnalysisItem[] = [
  {
    id: "1",
    date: new Date(2023, 10, 15),
    plannedDate: new Date(2023, 10, 10),
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
  const [expandedItems, setExpandedItems] = useState<{[key: string]: boolean}>({});
  
  const [inputAttachments, setInputAttachments] = useState<File[]>([]);
  const [outputAttachments, setOutputAttachments] = useState<File[]>([]);
  
  const [attachmentsDialogOpen, setAttachmentsDialogOpen] = useState(false);
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null);
  
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<CriticalAnalysisItem | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [analysisToEdit, setAnalysisToEdit] = useState<CriticalAnalysisItem | null>(null);
  
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);

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
    return files.map((file, index) => ({
      id: `new-att-${Date.now()}-${index}`,
      name: file.name,
      type: file.type,
      size: file.size,
      category
    }));
  };

  const handleAddAnalysis = (newAnalysis: CriticalAnalysisItem) => {
    if (isEditing) {
      setAnalyses(prev => prev.map(item => item.id === newAnalysis.id ? newAnalysis : item));
      setIsEditing(false);
      setAnalysisToEdit(null);
    } else {
      setAnalyses([...analyses, newAnalysis]);
    }
  };
  
  const handleEditAnalysis = (analysis: CriticalAnalysisItem) => {
    setAnalysisToEdit(analysis);
    setIsEditing(true);
    setOpen(true);
  };
  
  // Add delete analysis functionality
  const handleDeleteAnalysis = (analysisId: string) => {
    setAnalyses(prev => prev.filter(analysis => analysis.id !== analysisId));
    toast.success("Análise crítica excluída com sucesso!");
  };
  
  const handleAddAttachment = async () => {
    if (!currentAnalysisId) return;
    
    try {
      const inputAttachmentsList = await uploadFiles(inputAttachments, "input");
      const outputAttachmentsList = await uploadFiles(outputAttachments, "output");
      
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

  const handleViewReport = (analysis: CriticalAnalysisItem) => {
    setSelectedAnalysis(analysis);
    setReportDialogOpen(true);
  };
  
  const handleAnalysisUpdate = (updatedAnalysis: CriticalAnalysisItem) => {
    setAnalyses(prev => prev.map(analysis => 
      analysis.id === updatedAnalysis.id ? updatedAnalysis : analysis
    ));
    setSelectedAnalysis(updatedAnalysis);
  };

  // ------- NOVA FUNÇÃO PARA ANÁLISE VIA IA -------
  const handleAutomaticAnalysis = async () => {
    // Seleciona a análise do período atual (pode ser melhorado para múltipla seleção)
    // Usa a análise com data mais recente cujo status seja "planned" ou "in-progress"
    const currentPeriodAnalysis = analyses
      .filter(a => a.status !== "completed")
      .sort((a, b) => (b.date.getTime() - a.date.getTime()))[0];

    if (!currentPeriodAnalysis) {
      toast.warning("Nenhuma análise planejada/en andamento encontrada.");
      return;
    }
    setIsGeneratingAnalysis(true);
    toast.info(`Gerando análise crítica do período via IA...`);

    try {
      // Chama a Edge Function existente com o item
      const { data, error } = await (window as any).supabase.functions.invoke('generate-report', {
        body: { analysis: currentPeriodAnalysis }
      });

      if (error) {
        throw new Error(error.message || "Erro desconhecido");
      }

      if (!data || !data.report) {
        throw new Error("A IA não retornou o relatório.");
      }

      // Atualiza a análise com o conteúdo gerado por IA
      const updatedAnalysis = {
        ...currentPeriodAnalysis,
        aiGeneratedContent: data.report
      };
      setAnalyses(prev => prev.map(a => a.id === updatedAnalysis.id ? updatedAnalysis : a));
      toast.success("Análise crítica do período gerada com IA!");
      setSelectedAnalysis(updatedAnalysis);
      setReportDialogOpen(true);
    } catch (err: any) {
      toast.error(
        "Erro ao gerar análise automática",
        { description: err?.message || "Tente novamente mais tarde" }
      );
    } finally {
      setIsGeneratingAnalysis(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/40 flex flex-col">
      <main className="flex-1">
        <div className="max-w-6xl mx-auto p-6">
          <header className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  Análise Crítica
                  <span className="inline-block rounded bg-yellow-200 px-2 py-0.5 text-xs font-bold text-yellow-800 ml-2">GPT</span>
                </h1>
                <p className="text-muted-foreground mt-1">
                  Execução e acompanhamento das reuniões de análise crítica pela direção
                </p>
              </div>
              <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
                <Button
                  variant="secondary"
                  className="flex items-center"
                  disabled={isGeneratingAnalysis}
                  onClick={handleAutomaticAnalysis}
                  title="Gerar análise crítica automatizada através da IA"
                >
                  <span className={`mr-1 ${isGeneratingAnalysis ? 'animate-spin' : ''}`}>🤖</span>
                  {isGeneratingAnalysis ? "Gerando análise..." : "Análise Automática com IA"}
                </Button>
                <Button onClick={() => {
                  setAnalysisToEdit(null);
                  setIsEditing(false);
                  setOpen(true);
                }}>
                  <Plus size={16} className="mr-2" />
                  Nova Análise Crítica
                </Button>
              </div>
            </div>
          </header>
          <AnalysisStatusTabs 
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
          <AttachmentsDialog 
            open={attachmentsDialogOpen}
            setOpen={setAttachmentsDialogOpen}
            inputAttachments={inputAttachments}
            outputAttachments={outputAttachments}
            handleInputFileChange={handleInputFileChange}
            handleOutputFileChange={handleOutputFileChange}
            handleRemoveInputFile={handleRemoveInputFile}
            handleRemoveOutputFile={handleRemoveOutputFile}
            handleAddAttachment={handleAddAttachment}
            getFileIcon={getFileIcon}
            formatFileSize={formatFileSize}
          />
          <NewAnalysisDialog 
            open={open}
            setOpen={setOpen}
            onAddAnalysis={handleAddAnalysis}
            getFileIcon={getFileIcon}
            formatFileSize={formatFileSize}
            analysisToEdit={analysisToEdit}
          />
          <ReportDialog
            analysis={selectedAnalysis}
            open={reportDialogOpen}
            onOpenChange={setReportDialogOpen}
            onAnalysisUpdate={handleAnalysisUpdate}
          />
        </div>
      </main>
    </div>
  );
}
