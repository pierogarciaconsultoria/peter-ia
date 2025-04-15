
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FileText, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AssessmentResponse } from "@/types/recruitment";

export function AssessmentResultsList() {
  const [responses, setResponses] = useState<AssessmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { userCompany } = useAuth();

  useEffect(() => {
    fetchResponses();
  }, [userCompany?.id]);

  const fetchResponses = async () => {
    try {
      setLoading(true);
      
      // Simulated data for now - will be replaced with actual API call
      const mockResponses: AssessmentResponse[] = [
        {
          id: "1",
          assessment_id: "assessment-1",
          link_id: "link-1",
          candidate_name: "João Silva",
          candidate_email: "joao.silva@exemplo.com",
          answers: {
            "q1": "Resposta para pergunta 1",
            "values": ["Inovação", "Colaboração"],
            "disc": {
              D: 7,
              I: 12,
              S: 8,
              C: 5
            }
          },
          score: 85,
          submitted_at: "2023-11-15T14:30:00Z"
        },
        {
          id: "2",
          assessment_id: "assessment-2",
          link_id: "link-2",
          candidate_name: "Maria Oliveira",
          candidate_email: "maria.oliveira@exemplo.com",
          answers: {
            "q1": "Resposta para pergunta 1",
            "q2": 4,
            "values": ["Excelência", "Ética", "Responsabilidade"],
            "disc": {
              D: 5,
              I: 6,
              S: 15,
              C: 10
            }
          },
          score: 92,
          submitted_at: "2023-11-14T10:15:00Z"
        }
      ];
      
      setResponses(mockResponses);
    } catch (error) {
      console.error("Error fetching responses:", error);
      toast({
        title: "Erro ao carregar respostas",
        description: "Não foi possível carregar as respostas das avaliações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Carregando respostas...</p>
      </div>
    );
  }

  if (responses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nenhuma resposta de avaliação</CardTitle>
          <CardDescription>
            Ainda não há respostas de avaliações de candidatos
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            Envie avaliações para candidatos para começar a receber respostas
          </p>
          <Button variant="outline" onClick={fetchResponses}>
            <FileText className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Respostas de Avaliações</CardTitle>
            <CardDescription>
              Respostas enviadas pelos candidatos
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchResponses}>
            <FileText className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidato</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Pontuação</TableHead>
              <TableHead>Perfil DISC</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {responses.map((response) => {
              const discProfile = response.answers.disc as Record<string, number>;
              const primaryType = discProfile 
                ? Object.entries(discProfile).sort((a, b) => b[1] - a[1])[0][0]
                : null;
                
              return (
                <TableRow key={response.id}>
                  <TableCell className="font-medium">{response.candidate_name}</TableCell>
                  <TableCell>{response.candidate_email}</TableCell>
                  <TableCell>
                    {format(new Date(response.submitted_at), "dd/MM/yyyy HH:mm")}
                  </TableCell>
                  <TableCell>
                    {response.score 
                      ? <Badge className="bg-green-500">{response.score}%</Badge>
                      : <Badge variant="outline">N/A</Badge>
                    }
                  </TableCell>
                  <TableCell>
                    {primaryType ? (
                      <Badge variant="outline" className={
                        primaryType === 'D' ? "bg-red-100" :
                        primaryType === 'I' ? "bg-yellow-100" :
                        primaryType === 'S' ? "bg-green-100" :
                        "bg-blue-100"
                      }>
                        {primaryType}
                      </Badge>
                    ) : (
                      <Badge variant="outline">N/A</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
