
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FilePlus, FileCheck, FileText, Users } from "lucide-react";
import { Training } from "@/services/trainingService";

interface TrainingTableProps {
  trainings: Training[];
  isLoading: boolean;
}

export function TrainingTable({ trainings, isLoading }: TrainingTableProps) {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'planned': 
        return 'bg-blue-100 text-blue-800';
      case 'in_progress': 
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planned': 
        return 'Planejado';
      case 'in_progress': 
        return 'Em Andamento';
      case 'completed':
        return 'Concluído';
      default:
        return 'Cancelado';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (trainings.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FilePlus className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Nenhum treinamento encontrado</h3>
          <p className="text-muted-foreground text-center mt-2 max-w-md">
            Não encontramos treinamentos com os filtros atuais. Tente ajustar os filtros ou crie um novo treinamento.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {trainings.map((training) => (
        <Card key={training.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">{training.title}</CardTitle>
              <div className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusBadgeClass(training.status)}`}>
                {getStatusText(training.status)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">Instrutor:</span>
                  <p>{training.trainer}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Departamento:</span>
                  <p>{training.department}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Data:</span>
                  <p>{new Date(training.training_date).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Duração:</span>
                  <p>{training.duration} horas</p>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">Descrição:</span>
                  <p>{training.description || "Sem descrição"}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Participantes:</span>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {training.participants.map((participant, idx) => (
                      <Badge 
                        key={idx} 
                        variant="outline"
                        className="px-2 py-1 text-xs"
                      >
                        {participant.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                {training.evaluation_method && (
                  <div>
                    <span className="text-sm text-muted-foreground">Método de Avaliação:</span>
                    <p>{training.evaluation_method}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t pt-4">
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Gerenciar Participantes
            </Button>
            <Button variant="outline" size="sm">
              <FileCheck className="h-4 w-4 mr-2" />
              Registrar Conclusão
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Certificados
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
