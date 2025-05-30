
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExitInterview } from "@/types/exitInterviews";
import { Copy, Send, FileDown, Star } from "lucide-react";
import { ExitInterviewService } from "@/services/exitInterviewService";
import { useToast } from "@/components/ui/use-toast";

interface ExitInterviewDetailsDialogProps {
  interview: ExitInterview | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExitInterviewDetailsDialog({ 
  interview, 
  isOpen, 
  onOpenChange 
}: ExitInterviewDetailsDialogProps) {
  const { toast } = useToast();

  if (!interview) return null;

  const copyLink = async () => {
    const link = ExitInterviewService.generateInterviewLink(interview.token);
    try {
      await navigator.clipboard.writeText(link);
      toast({
        title: "Link copiado",
        description: "Link da entrevista copiado para a área de transferência.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o link.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>;
      case "sent":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Enviada</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completa</Badge>;
      case "expired":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Expirada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderRating = (rating?: number) => {
    if (!rating) return <span className="text-muted-foreground">Não avaliado</span>;
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`h-4 w-4 ${
              index < rating 
                ? "fill-yellow-400 text-yellow-400" 
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating}/5</span>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Entrevista de Desligamento</DialogTitle>
          <DialogDescription>
            Informações detalhadas sobre a entrevista de {interview.employee_name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Funcionário</p>
              <p className="font-medium">{interview.employee_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              {getStatusBadge(interview.status)}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data de Desligamento</p>
              <p className="font-medium">{new Date(interview.termination_date).toLocaleDateString('pt-BR')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data de Criação</p>
              <p className="font-medium">{new Date(interview.created_at).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>

          {interview.termination_reason && (
            <div>
              <p className="text-sm text-muted-foreground">Motivo do Desligamento</p>
              <p className="font-medium">{interview.termination_reason}</p>
            </div>
          )}

          {interview.employee_phone && (
            <div>
              <p className="text-sm text-muted-foreground">Telefone</p>
              <p className="font-medium">{interview.employee_phone}</p>
            </div>
          )}

          {/* Respostas da Entrevista (se completada) */}
          {interview.status === 'completed' && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-semibold">Respostas da Entrevista</h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Satisfação Geral</p>
                  {renderRating(interview.overall_satisfaction)}
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Ambiente de Trabalho</p>
                  {renderRating(interview.work_environment_rating)}
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Gestão</p>
                  {renderRating(interview.management_rating)}
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Oportunidades de Crescimento</p>
                  {renderRating(interview.growth_opportunities_rating)}
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Remuneração</p>
                  {renderRating(interview.compensation_rating)}
                </div>
              </div>

              {interview.what_liked_most && (
                <div>
                  <p className="text-sm text-muted-foreground">O que mais gostou</p>
                  <p className="mt-1 p-2 bg-muted rounded-md">{interview.what_liked_most}</p>
                </div>
              )}

              {interview.what_liked_least && (
                <div>
                  <p className="text-sm text-muted-foreground">O que menos gostou</p>
                  <p className="mt-1 p-2 bg-muted rounded-md">{interview.what_liked_least}</p>
                </div>
              )}

              {interview.suggestions_for_improvement && (
                <div>
                  <p className="text-sm text-muted-foreground">Sugestões de Melhoria</p>
                  <p className="mt-1 p-2 bg-muted rounded-md">{interview.suggestions_for_improvement}</p>
                </div>
              )}

              {interview.reason_for_leaving && (
                <div>
                  <p className="text-sm text-muted-foreground">Motivo da Saída</p>
                  <p className="mt-1 p-2 bg-muted rounded-md">{interview.reason_for_leaving}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Recomendaria a empresa?</p>
                  <p className="font-medium">
                    {interview.would_recommend_company === true ? "Sim" : 
                     interview.would_recommend_company === false ? "Não" : "Não respondido"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Consideraria retornar?</p>
                  <p className="font-medium">
                    {interview.would_consider_returning === true ? "Sim" : 
                     interview.would_consider_returning === false ? "Não" : "Não respondido"}
                  </p>
                </div>
              </div>

              {interview.additional_comments && (
                <div>
                  <p className="text-sm text-muted-foreground">Comentários Adicionais</p>
                  <p className="mt-1 p-2 bg-muted rounded-md">{interview.additional_comments}</p>
                </div>
              )}
            </div>
          )}

          {/* Ações */}
          <div className="flex justify-between border-t pt-4">
            <div className="flex gap-2">
              {interview.status === 'pending' && (
                <Button variant="outline" onClick={copyLink}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Link
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              {interview.status === 'completed' && (
                <Button>
                  <FileDown className="h-4 w-4 mr-2" />
                  Exportar Relatório
                </Button>
              )}
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
