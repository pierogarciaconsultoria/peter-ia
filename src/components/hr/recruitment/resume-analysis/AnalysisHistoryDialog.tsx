
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResumeAnalysis } from "@/types/recruitment";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, HelpCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AnalysisHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidateName: string;
  analysisHistory: ResumeAnalysis[];
}

export function AnalysisHistoryDialog({
  open,
  onOpenChange,
  candidateName,
  analysisHistory
}: AnalysisHistoryDialogProps) {
  const getRecommendationIcon = (recommendation: string) => {
    const lowerRec = recommendation.toLowerCase();
    if (lowerRec.includes("recomendado para próxima")) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (lowerRec.includes("possível candidato")) {
      return <HelpCircle className="h-4 w-4 text-amber-500" />;
    } else {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            Histórico de Análises de Currículo - {candidateName}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          {analysisHistory.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-muted-foreground">
                Nenhuma análise encontrada para este candidato
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {analysisHistory.map((analysis) => (
                <div 
                  key={analysis.id} 
                  className="border rounded-md p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {getRecommendationIcon(analysis.recommendation)}
                        <span className="ml-1 font-medium">
                          {analysis.recommendation}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Badge 
                        variant="outline"
                        className={`
                          ${analysis.compatibility_score >= 70 ? 'bg-green-50 text-green-700 border-green-200' : 
                          analysis.compatibility_score >= 50 ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                          'bg-red-50 text-red-700 border-red-200'}
                        `}
                      >
                        Compatibilidade: {analysis.compatibility_score}%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Pontos Fortes:</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {analysis.strengths.map((strength, i) => (
                          <li key={i}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Pontos Fracos:</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {analysis.weaknesses.map((weakness, i) => (
                          <li key={i}>{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Análise Detalhada:</h4>
                    <p className="text-sm whitespace-pre-line">{analysis.analysis}</p>
                  </div>
                  
                  <div className="text-xs text-muted-foreground border-t pt-2 mt-2">
                    {format(new Date(analysis.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
