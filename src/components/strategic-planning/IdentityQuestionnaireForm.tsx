
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { QuestionDisplay } from "./questionnaire/QuestionDisplay";
import { QuestionnaireProgress } from "./questionnaire/QuestionnaireProgress";
import { QuestionnaireResponse } from "./questionnaire/QuestionnaireResponse";
import { QuestionnaireNavigation } from "./questionnaire/QuestionnaireNavigation";
import { IdentityResponses, questionnaireData } from "./questionnaire/QuestionnaireTypes";

interface IdentityQuestionnaireFormProps {
  onSubmitResponses: (responses: IdentityResponses) => void;
  isGenerating: boolean;
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

    if (currentQuestion < questionnaireData[activeSection].length - 1) {
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
      setCurrentQuestion(questionnaireData.mission.length - 1);
    } else if (activeSection === "values") {
      setActiveSection("vision");
      setCurrentQuestion(questionnaireData.vision.length - 1);
    }
  };

  const calculateProgress = () => {
    const totalQuestions = 
      questionnaireData.mission.length + 
      questionnaireData.vision.length + 
      questionnaireData.values.length;
    
    const questionsAnswered = 
      (activeSection === "mission" ? currentQuestion : questionnaireData.mission.length) +
      (activeSection === "vision" ? currentQuestion : (activeSection === "values" ? questionnaireData.vision.length : 0));
    
    return ((questionsAnswered + 1) / totalQuestions) * 100;
  };

  // Is first or last question check
  const isFirstQuestion = activeSection === "mission" && currentQuestion === 0;
  const isLastQuestion = activeSection === "values" && currentQuestion === questionnaireData.values.length - 1;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">
          Questionário de Identidade Estratégica - {activeSection === "mission" ? "Missão" : activeSection === "vision" ? "Visão" : "Valores"}
        </CardTitle>
        
        <QuestionnaireProgress
          currentQuestion={currentQuestion}
          totalQuestions={questionnaireData[activeSection].length}
          progressPercentage={calculateProgress()}
        />
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <QuestionDisplay question={questionnaireData[activeSection][currentQuestion]} />
          
          <QuestionnaireResponse
            value={responses[activeSection][currentQuestion]}
            onChange={(e) => handleResponseChange(e.target.value)}
            isDisabled={isGenerating}
          />
          
          <QuestionnaireNavigation
            onPrevious={handlePrevious}
            onNext={handleNext}
            isFirstQuestion={isFirstQuestion}
            isLastQuestion={isLastQuestion}
            isGenerating={isGenerating}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// Re-export the IdentityResponses type so that it can still be imported from this file
export { type IdentityResponses } from "./questionnaire/QuestionnaireTypes";
