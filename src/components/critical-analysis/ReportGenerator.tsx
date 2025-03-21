
import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CriticalAnalysisItem } from "@/types/critical-analysis";
import { toast } from "sonner";

interface ReportGeneratorProps {
  analysis: CriticalAnalysisItem;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  onAnalysisUpdate?: (updatedAnalysis: CriticalAnalysisItem) => void;
}

export function ReportGenerator({ 
  analysis, 
  isGenerating, 
  setIsGenerating, 
  onAnalysisUpdate 
}: ReportGeneratorProps) {
  const generateAIReport = async () => {
    setIsGenerating(true);
    toast.info("Gerando relatório com IA, aguarde...");
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-report', {
        body: { analysis },
      });
      
      if (error) {
        console.error("Erro ao chamar função:", error);
        throw new Error(error.message);
      }
      
      if (!data || !data.report) {
        console.error("Resposta inválida:", data);
        throw new Error("Não foi possível gerar o relatório");
      }
      
      const updatedAnalysis = {
        ...analysis,
        aiGeneratedContent: data.report
      };
      
      if (onAnalysisUpdate) {
        onAnalysisUpdate(updatedAnalysis);
      }
      
      toast.success("Relatório gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      toast.error(`Ocorreu um erro ao gerar o relatório: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={generateAIReport} 
      disabled={isGenerating}
      title="Gerar relatório detalhado com IA"
    >
      {isGenerating ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
      Relatório Detalhado com IA
    </Button>
  );
}
