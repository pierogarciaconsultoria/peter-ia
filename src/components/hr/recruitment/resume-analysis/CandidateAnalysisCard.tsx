
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Candidate, ResumeAnalysis } from "@/types/recruitment";
import { ResumeAnalysisDialog } from "./ResumeAnalysisDialog";
import { getResumeAnalysesForCandidate, sendDiscAssessment } from "@/services/resumeAnalysisService";
import { FileText, CheckCircle, AlertCircle, HelpCircle, Send, History } from "lucide-react";
import { AnalysisHistoryDialog } from "./AnalysisHistoryDialog";

interface CandidateAnalysisCardProps {
  candidate: Candidate;
  jobOpeningId: string;
  jobDescription: string;
  assessmentId: string;
}

export function CandidateAnalysisCard({
  candidate,
  jobOpeningId,
  jobDescription,
  assessmentId
}: CandidateAnalysisCardProps) {
  const [isAnalysisDialogOpen, setIsAnalysisDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<ResumeAnalysis | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<ResumeAnalysis[]>([]);
  const [isSendingAssessment, setIsSendingAssessment] = useState(false);
  const { toast } = useToast();

  const handleAnalysisComplete = (analysisResult: any) => {
    const analysis = {
      id: crypto.randomUUID(),
      candidate_id: candidate.id,
      job_opening_id: jobOpeningId,
      compatibility_score: analysisResult.compatibility_score,
      recommendation: analysisResult.recommendation,
      strengths: analysisResult.strengths,
      weaknesses: analysisResult.weaknesses,
      analysis: analysisResult.analysis,
      created_at: new Date().toISOString(),
      created_by: 'current-user' // Isso seria substituído pelo ID do usuário atual
    };
    
    setLastAnalysis(analysis);
    toast({
      title: "Análise salva com sucesso",
      description: `Compatibilidade: ${analysisResult.compatibility_score}%`
    });
  };

  const fetchAnalysisHistory = async () => {
    try {
      const history = await getResumeAnalysesForCandidate(candidate.id);
      setAnalysisHistory(history);
      
      // Atualiza a última análise se houver histórico
      if (history.length > 0) {
        setLastAnalysis(history[0]);
      }
      
      setIsHistoryDialogOpen(true);
    } catch (error) {
      toast({
        title: "Erro ao carregar histórico",
        description: "Não foi possível carregar o histórico de análises",
        variant: "destructive"
      });
    }
  };

  const handleSendDiscAssessment = async () => {
    setIsSendingAssessment(true);
    try {
      await sendDiscAssessment(candidate.id, assessmentId);
      toast({
        title: "Avaliação DISC enviada com sucesso",
        description: `Foi enviada para ${candidate.email}`
      });
    } catch (error: any) {
      toast({
        title: "Erro ao enviar avaliação DISC",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive"
      });
    } finally {
      setIsSendingAssessment(false);
    }
  };

  const getRecommendationBadge = () => {
    if (!lastAnalysis) return null;
    
    const recommendation = lastAnalysis.recommendation.toLowerCase();
    if (recommendation.includes("recomendado para próxima")) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Recomendado
        </Badge>
      );
    } else if (recommendation.includes("possível candidato")) {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
          <HelpCircle className="h-3 w-3" />
          Possível candidato
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Não recomendado
        </Badge>
      );
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{candidate.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{candidate.email}</p>
            </div>
            {getRecommendationBadge()}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {lastAnalysis && (
              <div className="text-sm space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Compatibilidade:</span>
                  <span 
                    className={`font-bold ${
                      lastAnalysis.compatibility_score >= 70 ? 'text-green-500' : 
                      lastAnalysis.compatibility_score >= 50 ? 'text-amber-500' : 
                      'text-red-500'
                    }`}
                  >
                    {lastAnalysis.compatibility_score}%
                  </span>
                </div>
                <p className="line-clamp-2 text-muted-foreground">
                  Última análise: {new Date(lastAnalysis.created_at).toLocaleString()}
                </p>
              </div>
            )}
            {!lastAnalysis && (
              <div className="py-2 text-center text-muted-foreground text-sm">
                <p>Nenhuma análise realizada</p>
                <p>Clique em "Analisar Currículo" para iniciar</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsAnalysisDialogOpen(true)}
            >
              <FileText className="h-4 w-4 mr-1" />
              Analisar Currículo
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={fetchAnalysisHistory}
            >
              <History className="h-4 w-4 mr-1" />
              Histórico
            </Button>
          </div>
          
          <Button 
            variant="default" 
            size="sm"
            disabled={isSendingAssessment || !lastAnalysis || lastAnalysis.compatibility_score < 50}
            onClick={handleSendDiscAssessment}
          >
            <Send className="h-4 w-4 mr-1" />
            Enviar Avaliação DISC
          </Button>
        </CardFooter>
      </Card>

      <ResumeAnalysisDialog 
        open={isAnalysisDialogOpen}
        onOpenChange={setIsAnalysisDialogOpen}
        candidateId={candidate.id}
        candidateName={candidate.name}
        jobOpeningId={jobOpeningId}
        jobDescription={jobDescription}
        resumeText=""
        onAnalysisComplete={handleAnalysisComplete}
      />
      
      <AnalysisHistoryDialog 
        open={isHistoryDialogOpen}
        onOpenChange={setIsHistoryDialogOpen}
        candidateName={candidate.name}
        analysisHistory={analysisHistory}
      />
    </>
  );
}
