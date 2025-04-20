
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, Sparkles } from "lucide-react";
import { QuestionDisplay } from "./QuestionDisplay";
import { QuestionnaireProgress } from "./QuestionnaireProgress";
import { QuestionnaireResponse } from "./QuestionnaireResponse";
import { IdentityQuestionsType, QuestionnaireResponsesType } from "./QuestionnaireTypes";

// Questions to guide the AI in generating strategic identity
const MISSION_QUESTIONS = [
  "Qual é o propósito principal da sua organização?",
  "Que problema sua organização resolve para os clientes ou para a sociedade?",
  "O que motivou a criação da sua organização?",
  "Qual impacto positivo você quer causar no mundo?"
];

const VISION_QUESTIONS = [
  "Como você vê sua organização em 5-10 anos?",
  "Qual é o futuro que você deseja construir?",
  "Como será o sucesso da sua organização no longo prazo?",
  "O que diferenciará sua organização das outras no futuro?"
];

const VALUES_QUESTIONS = [
  "Quais princípios são inegociáveis em sua organização?",
  "Quais comportamentos você valoriza em seus colaboradores?",
  "Quais crenças guiam suas decisões organizacionais?",
  "O que sua organização jamais comprometeria, mesmo em tempos difíceis?"
];

interface IdentityQuestionnaireProps {
  onComplete: (suggestedIdentity: any) => void;
  onCancel: () => void;
}

export function IdentityQuestionnaire({ onComplete, onCancel }: IdentityQuestionnaireProps) {
  const [currentSection, setCurrentSection] = useState<"mission" | "vision" | "values">("mission");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<QuestionnaireResponsesType>({
    mission: ["", "", "", ""],
    vision: ["", "", "", ""],
    values: ["", "", "", ""]
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const questions: IdentityQuestionsType = {
    mission: MISSION_QUESTIONS,
    vision: VISION_QUESTIONS,
    values: VALUES_QUESTIONS
  };

  const handleResponseChange = (value: string) => {
    setResponses(prev => {
      const updated = { ...prev };
      updated[currentSection][currentQuestionIndex] = value;
      return updated;
    });
  };

  const navigateNext = () => {
    if (currentQuestionIndex < questions[currentSection].length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentSection === "mission") {
      setCurrentSection("vision");
      setCurrentQuestionIndex(0);
    } else if (currentSection === "vision") {
      setCurrentSection("values");
      setCurrentQuestionIndex(0);
    }
  };

  const navigatePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentSection === "values") {
      setCurrentSection("vision");
      setCurrentQuestionIndex(questions.vision.length - 1);
    } else if (currentSection === "vision") {
      setCurrentSection("mission");
      setCurrentQuestionIndex(questions.mission.length - 1);
    }
  };

  const generateIdentity = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('https://kxkcgbtsgfyisbrtjmvv.supabase.co/functions/v1/generate-strategic-identity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ responses }),
      });

      if (!response.ok) {
        throw new Error('Falha ao gerar sugestões para identidade estratégica');
      }

      const data = await response.json();
      onComplete(data);
    } catch (error) {
      console.error('Erro ao gerar identidade estratégica:', error);
      alert('Ocorreu um erro ao gerar as sugestões. Por favor, tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const currentQuestion = questions[currentSection][currentQuestionIndex];
  const currentResponse = responses[currentSection][currentQuestionIndex];
  
  const totalQuestions = questions.mission.length + questions.vision.length + questions.values.length;
  const answeredQuestions = 
    responses.mission.filter(r => r.trim() !== "").length + 
    responses.vision.filter(r => r.trim() !== "").length + 
    responses.values.filter(r => r.trim() !== "").length;
  
  const progress = Math.round((answeredQuestions / totalQuestions) * 100);
  const isLastQuestion = currentSection === "values" && currentQuestionIndex === questions.values.length - 1;
  const canSubmit = progress >= 75; // Require at least 75% completion

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 text-primary mr-2" />
            Questionário de Identidade Estratégica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <QuestionnaireProgress progress={progress} />
          
          <QuestionDisplay 
            question={currentQuestion} 
            section={currentSection}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions[currentSection].length}
          />
          
          <QuestionnaireResponse
            value={currentResponse}
            onChange={handleResponseChange}
            onNext={navigateNext}
            onPrevious={navigatePrevious}
            isFirstQuestion={currentSection === "mission" && currentQuestionIndex === 0}
            isLastQuestion={isLastQuestion}
          />
          
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            
            <Button
              onClick={generateIdentity}
              disabled={!canSubmit || isGenerating}
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Gerar Sugestões
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
