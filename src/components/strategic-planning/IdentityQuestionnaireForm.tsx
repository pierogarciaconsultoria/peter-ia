
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, ThumbsUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const questions = {
  mission: [
    "Qual é o propósito fundamental da sua empresa?",
    "Quais problemas ou necessidades a sua empresa busca resolver?",
    "Quem são os principais beneficiários do trabalho da sua empresa?",
    "Como a sua empresa impacta positivamente a sociedade?",
    "Qual legado a sua empresa pretende deixar no mundo?"
  ],
  vision: [
    "Onde você imagina que sua empresa estará daqui a 5-10 anos?",
    "Qual é o objetivo final que sua empresa busca atingir no longo prazo?",
    "Como você deseja que sua empresa seja reconhecida no mercado?",
    "Qual impacto transformador sua empresa deseja ter no setor?",
    "Qual é o sonho mais ambicioso para o futuro da sua empresa?"
  ],
  values: [
    "Quais princípios são inegociáveis para sua empresa?",
    "Quais comportamentos são consistentemente recompensados na sua organização?",
    "Quais características culturais diferenciam sua empresa dos concorrentes?",
    "Quais valores pessoais dos fundadores refletem na empresa?",
    "Quais crenças fundamentais guiam as decisões na sua empresa?"
  ]
};

interface IdentityQuestionnaireFormProps {
  onSubmitResponses: (responses: IdentityResponses) => void;
  isGenerating: boolean;
}

export interface IdentityResponses {
  mission: string[];
  vision: string[];
  values: string[];
}

export function IdentityQuestionnaireForm({ onSubmitResponses, isGenerating }: IdentityQuestionnaireFormProps) {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<"mission" | "vision" | "values">("mission");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<IdentityResponses>({
    mission: ["", "", "", "", ""],
    vision: ["", "", "", "", ""],
    values: ["", "", "", "", ""]
  });

  const handleResponseChange = (response: string) => {
    setResponses(prev => ({
      ...prev,
      [activeSection]: prev[activeSection].map((r, i) => 
        i === currentQuestion ? response : r
      )
    }));
  };

  const handleNext = () => {
    if (responses[activeSection][currentQuestion].trim() === "") {
      toast({
        title: "Campo vazio",
        description: "Por favor, responda à pergunta antes de continuar.",
        variant: "destructive",
      });
      return;
    }

    if (currentQuestion < questions[activeSection].length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (activeSection === "mission") {
      setActiveSection("vision");
      setCurrentQuestion(0);
    } else if (activeSection === "vision") {
      setActiveSection("values");
      setCurrentQuestion(0);
    } else {
      // All questions answered, submit responses
      onSubmitResponses(responses);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (activeSection === "vision") {
      setActiveSection("mission");
      setCurrentQuestion(questions.mission.length - 1);
    } else if (activeSection === "values") {
      setActiveSection("vision");
      setCurrentQuestion(questions.vision.length - 1);
    }
  };

  const calculateProgress = () => {
    const totalQuestions = 
      questions.mission.length + 
      questions.vision.length + 
      questions.values.length;
    
    const questionsAnswered = 
      (activeSection === "mission" ? currentQuestion : questions.mission.length) +
      (activeSection === "vision" ? currentQuestion : (activeSection === "values" ? questions.vision.length : 0));
    
    return ((questionsAnswered + 1) / totalQuestions) * 100;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">
          Questionário de Identidade Estratégica - {activeSection === "mission" ? "Missão" : activeSection === "vision" ? "Visão" : "Valores"}
        </CardTitle>
        
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${calculateProgress()}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Pergunta {currentQuestion + 1} de {questions[activeSection].length}
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="min-h-[120px] border rounded-md p-4 bg-muted/30">
            <p className="text-lg font-medium">{questions[activeSection][currentQuestion]}</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="response">Sua resposta</Label>
            <Textarea
              id="response"
              rows={4}
              value={responses[activeSection][currentQuestion]}
              onChange={(e) => handleResponseChange(e.target.value)}
              placeholder="Digite sua resposta aqui..."
              className="resize-none"
              disabled={isGenerating}
            />
          </div>
          
          <div className="flex justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={activeSection === "mission" && currentQuestion === 0 || isGenerating}
            >
              Anterior
            </Button>
            
            <Button
              type="button"
              onClick={handleNext}
              disabled={isGenerating}
              className={cn(
                activeSection === "values" && currentQuestion === questions.values.length - 1 
                  ? "bg-green-600 hover:bg-green-700" 
                  : ""
              )}
            >
              {activeSection === "values" && currentQuestion === questions.values.length - 1 ? (
                <>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gerando sugestões...
                    </>
                  ) : (
                    <>
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      Finalizar e gerar sugestões
                    </>
                  )}
                </>
              ) : (
                <>
                  Próxima
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
