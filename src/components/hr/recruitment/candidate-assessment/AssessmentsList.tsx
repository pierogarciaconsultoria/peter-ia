
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Send, RefreshCw, Eye, MoreHorizontal, Copy } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CandidateAssessment } from "@/services/candidateAssessmentService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AssessmentsListProps {
  assessments: CandidateAssessment[];
  onSendAssessment: (assessment: CandidateAssessment) => void;
  onRefresh: () => void;
}

export function AssessmentsList({ 
  assessments, 
  onSendAssessment,
  onRefresh
}: AssessmentsListProps) {
  return (
    <div className="space-y-4">
      {assessments.map((assessment) => (
        <Card key={assessment.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{assessment.title}</CardTitle>
                <CardDescription>
                  {assessment.created_at 
                    ? `Criado em ${format(new Date(assessment.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`
                    : "Nova avaliação"}
                </CardDescription>
              </div>
              <Badge variant={assessment.active ? "default" : "secondary"}>
                {assessment.active ? "Ativo" : "Inativo"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-sm text-muted-foreground">
              {assessment.description || "Sem descrição"}
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="outline" className="text-xs">
                {assessment.questions.length} perguntas
              </Badge>
              
              {assessment.questions.some(q => q.id === "company_values") && (
                <Badge variant="outline" className="text-xs bg-blue-50">
                  Valores da empresa
                </Badge>
              )}
              
              {assessment.questions.some(q => q.id === "disc_assessment") && (
                <Badge variant="outline" className="text-xs bg-purple-50">
                  Avaliação DISC
                </Badge>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-2 border-t">
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Atualizar
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => onSendAssessment(assessment)}
              >
                <Send className="h-4 w-4 mr-1" />
                Enviar para Candidato
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Eye className="h-4 w-4 mr-2" />
                    Visualizar
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
