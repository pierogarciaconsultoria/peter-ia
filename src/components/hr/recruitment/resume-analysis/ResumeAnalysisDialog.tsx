
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, AlertCircle, HelpCircle } from "lucide-react";
import { analyzeResume, saveResumeAnalysis } from "@/services/resumeAnalysisService";
import { useAuth } from "@/hooks/useAuth";

interface ResumeAnalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidateId: string;
  candidateName: string;
  jobOpeningId: string;
  jobDescription: string;
  resumeText?: string;
  onAnalysisComplete: (analysisResult: any) => void;
}

export function ResumeAnalysisDialog({
  open,
  onOpenChange,
  candidateId,
  candidateName,
  jobOpeningId,
  jobDescription,
  resumeText: initialResumeText,
  onAnalysisComplete
}: ResumeAnalysisDialogProps) {
  const [resumeText, setResumeText] = useState(initialResumeText || "");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      toast({
        title: "Texto do currículo é obrigatório",
        description: "Por favor, cole o texto do currículo para análise",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeResume(resumeText, jobDescription);
      setAnalysisResult(result);
      
      // Salvar o resultado da análise no banco de dados
      if (user) {
        await saveResumeAnalysis({
          candidate_id: candidateId,
          job_opening_id: jobOpeningId,
          compatibility_score: result.compatibility_score,
          recommendation: result.recommendation,
          strengths: result.strengths,
          weaknesses: result.weaknesses,
          analysis: result.analysis,
          created_by: user.id
        });
      }
      
      toast({
        title: "Análise concluída",
        description: `Compatibilidade: ${result.compatibility_score}%`,
      });
      
    } catch (error: any) {
      toast({
        title: "Erro na análise",
        description: error.message || "Ocorreu um erro ao analisar o currículo",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleComplete = () => {
    if (analysisResult) {
      onAnalysisComplete(analysisResult);
    }
    onOpenChange(false);
  };

  const getRecommendationIcon = () => {
    if (!analysisResult) return <HelpCircle className="h-5 w-5" />;
    
    const recommendation = analysisResult.recommendation.toLowerCase();
    if (recommendation.includes("recomendado para próxima")) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (recommendation.includes("possível candidato")) {
      return <HelpCircle className="h-5 w-5 text-amber-500" />;
    } else {
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Análise de Currículo com IA</DialogTitle>
          <DialogDescription>
            Analise o currículo de {candidateName} para verificar a compatibilidade com a vaga
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow overflow-hidden">
          <div className="flex flex-col space-y-2 overflow-hidden">
            <Label htmlFor="resume">Texto do Currículo</Label>
            <Textarea 
              id="resume" 
              value={resumeText} 
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Cole o texto do currículo aqui..."
              className="flex-grow resize-none h-full min-h-[200px] font-mono text-sm"
            />
          </div>
          
          <div className="flex flex-col space-y-2 overflow-hidden">
            <div className="flex justify-between items-center">
              <Label>Resultado da Análise</Label>
              {analysisResult && (
                <div className="flex items-center space-x-2 text-sm">
                  <span>Compatibilidade:</span>
                  <span 
                    className={`font-bold ${
                      analysisResult.compatibility_score >= 70 ? 'text-green-500' : 
                      analysisResult.compatibility_score >= 50 ? 'text-amber-500' : 
                      'text-red-500'
                    }`}
                  >
                    {analysisResult.compatibility_score}%
                  </span>
                </div>
              )}
            </div>
            
            {isAnalyzing ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center space-y-2">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <span>Analisando currículo...</span>
                </div>
              </div>
            ) : analysisResult ? (
              <div className="bg-muted/50 p-4 rounded-md overflow-y-auto flex-grow text-sm">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex-shrink-0">
                    {getRecommendationIcon()}
                  </div>
                  <span className="font-medium">{analysisResult.recommendation}</span>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-bold mb-1">Pontos Fortes:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {analysisResult.strengths.map((strength: string, i: number) => (
                      <li key={i}>{strength}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-bold mb-1">Pontos Fracos:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {analysisResult.weaknesses.map((weakness: string, i: number) => (
                      <li key={i}>{weakness}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold mb-1">Análise Detalhada:</h4>
                  <p className="whitespace-pre-line">{analysisResult.analysis}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full bg-muted/30 rounded-md">
                <span className="text-muted-foreground">
                  Clique em "Analisar Currículo" para iniciar
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isAnalyzing}
          >
            Cancelar
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !resumeText.trim()}
              className="gap-2"
            >
              {isAnalyzing && <Loader2 className="h-4 w-4 animate-spin" />}
              Analisar Currículo
            </Button>
            
            {analysisResult && (
              <Button onClick={handleComplete} variant="default">
                Concluir Análise
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
