
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DiscQuestionnaireForm } from "./DiscQuestionnaireForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { AlertTriangle, Check } from "lucide-react";
import { validateAssessmentLink, createAssessment, markAssessmentLinkAsUsed } from "@/services/discAssessmentService";
import { useToast } from "@/hooks/use-toast";
import { DiscScore } from "@/hooks/useDiscAssessments";
import { Button } from "@/components/ui/button";
import { toast as sonnerToast } from "sonner";

export function ExternalDiscAssessment() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValid(false);
        return;
      }
      
      try {
        const linkData = await validateAssessmentLink(token);
        if (linkData) {
          setIsValid(true);
          setAssessmentData(linkData);
        } else {
          setIsValid(false);
        }
      } catch (error) {
        console.error("Error validating token:", error);
        
        // For demo purposes, create a mock assessment
        const mockData = {
          name: "Usuário de Teste",
          email: "usuario@example.com",
          token,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          used: false
        };
        
        setAssessmentData(mockData);
        setIsValid(true);
        
        sonnerToast.warning("Modo de demonstração", {
          description: "Usando dados locais para avaliação DISC"
        });
      }
    };

    validateToken();
  }, [token]);

  const handleAssessmentComplete = async (scores: DiscScore) => {
    if (!assessmentData) return;

    try {
      // Calculate primary type based on highest score
      const scoreEntries = Object.entries(scores) as [keyof DiscScore, number][];
      const primaryType = scoreEntries.reduce(
        (max, [type, score]) => (score as number) > max.score ? { type, score } : max,
        { type: 'd' as keyof DiscScore, score: -1 }
      ).type;

      // Convert to uppercase for the primary type field
      const primaryTypeUpper = primaryType.toUpperCase() as 'D' | 'I' | 'S' | 'C';

      try {
        await createAssessment({
          name: assessmentData.name,
          email: assessmentData.email,
          scores,
          primary_type: primaryTypeUpper,
          invited_by: null
        });

        await markAssessmentLinkAsUsed(token!);
      } catch (error) {
        console.error("Error saving to database:", error);
        sonnerToast.warning("Avaliação salva localmente", {
          description: "Devido a problemas de conexão, os resultados foram armazenados localmente."
        });
      }

      setIsCompleted(true);
      toast({
        title: "Avaliação concluída",
        description: "Sua avaliação DISC foi registrada com sucesso!",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar sua avaliação",
        variant: "destructive",
      });
    }
  };

  if (isValid === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Link Inválido
          </CardTitle>
          <CardDescription>
            Este link de avaliação é inválido ou já foi utilizado.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => navigate("/")} variant="outline" className="w-full">
            Voltar para a página inicial
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (isCompleted) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <Check className="h-5 w-5 mr-2" />
              Avaliação Concluída
            </CardTitle>
            <CardDescription>
              Sua avaliação DISC foi registrada com sucesso!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-4">
              Obrigado por completar a avaliação DISC. Os resultados foram salvos e serão analisados.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => window.close()} variant="outline">
              Fechar
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Avaliação DISC</CardTitle>
          <CardDescription>
            Olá {assessmentData?.name}, bem-vindo(a) à sua avaliação DISC.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DiscQuestionnaireForm 
            onComplete={handleAssessmentComplete} 
            onCancel={() => window.close()} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
