
import React, { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Share2, FileText, BarChart2, GitBranch, Clock } from "lucide-react";
import { BpmnDiagram } from "@/components/processes/BpmnDiagram";
import { ProcessAnalysis } from "@/components/processes/ProcessAnalysis";
import { ValueStreamMap } from "@/components/processes/ValueStreamMap";
import { ActionPlan } from "@/components/processes/ActionPlan";

interface ReportDialogProps {
  processData: any;
  open: boolean;
  onClose: () => void;
}

export function ReportDialog({ processData, open, onClose }: ReportDialogProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [activeTab, setActiveTab] = useState("bpmn");
  const [analysisData, setAnalysisData] = useState(null);
  
  // Simulate API call to generate analysis
  useEffect(() => {
    const generateAnalysis = async () => {
      // In a real implementation, this would be an API call to GPT or similar service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAnalysisData({
        strengths: [
          "Processo bem definido com claras entradas e saídas",
          "Indicadores de performance bem estabelecidos",
          "Responsáveis claramente identificados para cada atividade"
        ],
        weaknesses: [
          "Potenciais gargalos na aprovação",
          "Falta de automação em etapas críticas",
          "Tempo de ciclo possivelmente elevado"
        ],
        recommendations: [
          "Implementar automação nas etapas de validação",
          "Criar pontos de verificação intermediários",
          "Estabelecer SLAs para cada etapa do processo"
        ],
        vsm: {
          cycleTime: "3-5 dias",
          valueAddedTime: "60%",
          nonValueAddedTime: "40%",
          bottlenecks: ["Aprovação", "Validação de dados"]
        },
        actionPlan: [
          {
            action: "Implementar sistema de aprovação automática para casos simples",
            responsible: "TI",
            deadline: "30 dias",
            status: "Pendente"
          },
          {
            action: "Definir SLAs para cada etapa do processo",
            responsible: "Qualidade",
            deadline: "15 dias",
            status: "Pendente"
          },
          {
            action: "Treinamento da equipe nas novas diretrizes",
            responsible: "RH",
            deadline: "45 dias",
            status: "Pendente"
          }
        ]
      });
      
      setIsAnalyzing(false);
    };
    
    if (open && processData) {
      generateAnalysis();
    }
    
    return () => {
      // Cleanup if needed
    };
  }, [open, processData]);

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
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Relatório de Processo: {processData?.name || "Novo Processo"}
          </DialogTitle>
          <DialogDescription>
            Análise detalhada do processo em formato BPMN com recomendações geradas por IA
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
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
          
          <TabsContent value="bpmn" className="border rounded-md p-4">
            {isAnalyzing ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-[400px] w-full" />
              </div>
            ) : (
              <BpmnDiagram processData={processData} />
            )}
          </TabsContent>
          
          <TabsContent value="analysis" className="border rounded-md p-4">
            {isAnalyzing ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : (
              <ProcessAnalysis analysisData={analysisData} />
            )}
          </TabsContent>
          
          <TabsContent value="vsm" className="border rounded-md p-4">
            {isAnalyzing ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-[300px] w-full" />
              </div>
            ) : (
              <ValueStreamMap vsmData={analysisData?.vsm} processData={processData} />
            )}
          </TabsContent>
          
          <TabsContent value="action" className="border rounded-md p-4">
            {isAnalyzing ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <ActionPlan actionPlanData={analysisData?.actionPlan} />
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between sm:justify-between gap-2">
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" /> Exportar PDF
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" /> Compartilhar
            </Button>
          </div>
          <Button onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
