
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ClimateSurveyQuestion } from "@/services/climateSurveyService";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SurveyResponseFormProps {
  surveyId: string;
  title: string;
  description: string;
  questions: ClimateSurveyQuestion[];
  onSubmit: (responses: any) => Promise<void>;
  isLoading: boolean;
}

export function SurveyResponseForm({
  surveyId,
  title,
  description,
  questions,
  onSubmit,
  isLoading
}: SurveyResponseFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Verificar se temos perguntas
  const hasQuestions = questions.length > 0;
  
  // Pegar a pergunta atual
  const currentQuestion = hasQuestions ? questions[currentStep] : null;
  
  // Calcular progresso
  const progress = hasQuestions ? (currentStep / questions.length) * 100 : 0;
  
  // Verificar se já respondeu a pergunta atual
  const hasAnswered = currentQuestion ? responses[currentQuestion.id] !== undefined : false;
  
  // Verificar se a pergunta atual é obrigatória
  const isRequired = currentQuestion?.required ?? false;
  
  // Verificar se pode avançar
  const canAdvance = !isRequired || hasAnswered;
  
  // Verificar se está na última pergunta
  const isLastQuestion = currentStep === questions.length - 1;
  
  // Verificar se todas as perguntas obrigatórias foram respondidas
  const allRequiredAnswered = hasQuestions && questions
    .filter(q => q.required)
    .every(q => responses[q.id] !== undefined);
  
  // Lidar com a resposta para a pergunta atual
  const handleResponse = (value: any) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestion!.id]: value
    }));
  };
  
  // Navegar para a próxima pergunta
  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  // Navegar para a pergunta anterior
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  // Enviar as respostas
  const handleSubmit = async () => {
    if (!allRequiredAnswered) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(responses);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Renderizar o input de acordo com o tipo de pergunta
  const renderQuestionInput = () => {
    if (!currentQuestion) return null;
    
    const questionId = currentQuestion.id;
    const currentValue = responses[questionId];
    
    switch (currentQuestion.question_type) {
      case "scale":
        return (
          <div className="space-y-4">
            <div className="flex justify-between text-xs px-1">
              <span>Discordo Totalmente</span>
              <span>Concordo Totalmente</span>
            </div>
            <div className="flex gap-2 justify-between">
              {[1, 2, 3, 4, 5].map((value) => (
                <Button
                  key={value}
                  type="button"
                  onClick={() => handleResponse(value)}
                  variant={currentValue === value ? "default" : "outline"}
                  className="flex-1 h-12"
                >
                  {value}
                </Button>
              ))}
            </div>
          </div>
        );
      
      case "text":
        return (
          <Textarea
            value={currentValue || ""}
            onChange={(e) => handleResponse(e.target.value)}
            placeholder="Digite sua resposta..."
            className="min-h-[120px]"
          />
        );
      
      case "multiple_choice":
        return (
          <RadioGroup
            value={currentValue}
            onValueChange={handleResponse}
            className="space-y-3"
          >
            {currentQuestion.options?.choices?.map((choice: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={choice} id={`choice-${index}`} />
                <Label htmlFor={`choice-${index}`}>{choice}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      
      case "boolean":
        return (
          <RadioGroup
            value={currentValue?.toString()}
            onValueChange={(value) => handleResponse(value === "true")}
            className="flex space-x-8"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="yes" />
              <Label htmlFor="yes">Sim</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="no" />
              <Label htmlFor="no">Não</Label>
            </div>
          </RadioGroup>
        );
      
      default:
        return null;
    }
  };
  
  // Renderizar durante carregamento
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-60 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription className="mt-2">{description}</CardDescription>
            </div>
            <Badge>{currentStep + 1} de {questions.length}</Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        
        {!hasQuestions ? (
          <CardContent className="pt-4 pb-8 text-center">
            <p className="text-muted-foreground">
              Esta pesquisa não possui perguntas.
            </p>
          </CardContent>
        ) : (
          <>
            <CardContent className="pt-4 pb-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-start">
                    <h3 className="text-lg font-medium">
                      {currentQuestion?.question}
                      {isRequired && <span className="text-destructive ml-1">*</span>}
                    </h3>
                  </div>
                  
                  <div className="pt-4">
                    {renderQuestionInput()}
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Anterior
              </Button>
              
              {isLastQuestion ? (
                <Button 
                  onClick={handleSubmit}
                  disabled={!allRequiredAnswered || isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Concluir
                    </>
                  )}
                </Button>
              ) : (
                <Button 
                  onClick={handleNext}
                  disabled={!canAdvance}
                >
                  Próxima
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
