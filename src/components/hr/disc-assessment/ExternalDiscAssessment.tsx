
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DiscQuestionnaireForm } from "./DiscQuestionnaireForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { validateAssessmentLink, createAssessment, markAssessmentLinkAsUsed } from "@/services/discAssessmentService";
import { useToast } from "@/hooks/use-toast";

export function ExternalDiscAssessment() {
  const { token } = useParams();
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const validateToken = async () => {
      if (!token) return;
      
      const linkData = await validateAssessmentLink(token);
      if (linkData) {
        setIsValid(true);
        setAssessmentData(linkData);
      } else {
        setIsValid(false);
      }
    };

    validateToken();
  }, [token]);

  const handleAssessmentComplete = async (scores: any) => {
    if (!assessmentData) return;

    try {
      // Calculate primary type based on highest score
      const primaryType = Object.entries(scores).reduce(
        (max, [type, score]) => score > max.score ? { type, score } : max,
        { type: 'D', score: -1 }
      ).type as 'D' | 'I' | 'S' | 'C';

      await createAssessment({
        name: assessmentData.name,
        email: assessmentData.email,
        scores,
        primary_type: primaryType,
        invited_by: null
      });

      await markAssessmentLinkAsUsed(token!);

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
      </Card>
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
          <DiscQuestionnaireForm onComplete={handleAssessmentComplete} />
        </CardContent>
      </Card>
    </div>
  );
}
