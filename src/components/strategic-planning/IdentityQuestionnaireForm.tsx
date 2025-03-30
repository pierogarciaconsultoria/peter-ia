
import { useState } from "react";
import { QuestionDisplay } from "./questionnaire/QuestionDisplay";
import { QuestionnaireProgress } from "./questionnaire/QuestionnaireProgress";
import { QuestionnaireNavigation } from "./questionnaire/QuestionnaireNavigation";
import { QuestionnaireResponse } from "./questionnaire/QuestionnaireResponse";

export interface IdentityResponses {
  purpose?: string;
  uniqueness?: string;
  values?: string;
  ambition?: string;
  impact?: string;
}

interface IdentityQuestionnaireFormProps {
  onSubmitResponses: (responses: IdentityResponses) => void;
  isGenerating: boolean;
}

// Questionnaire questions
const questions = [
  "Qual é o propósito fundamental da sua organização? Por que ela existe?",
  "O que torna sua organização única? Quais são suas principais competências e diferenciais?",
  "Quais são os valores fundamentais que guiam as decisões e comportamentos na sua organização?",
  "Onde sua organização quer estar em 5 a 10 anos? Qual é a sua ambição de longo prazo?",
  "Qual impacto positivo sua organização deseja ter no mundo, para seus clientes, colaboradores e comunidade?",
];

export function IdentityQuestionnaireForm({ onSubmitResponses, isGenerating }: IdentityQuestionnaireFormProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<IdentityResponses>({});

  // Calculate progress percentage
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleResponseChange = (response: string) => {
    setResponses({
      ...responses,
      [getResponseKey(currentQuestionIndex)]: response,
    });
  };

  const handleSubmit = () => {
    onSubmitResponses(responses);
  };

  // Helper to map question index to response key
  const getResponseKey = (index: number): keyof IdentityResponses => {
    switch (index) {
      case 0: return "purpose";
      case 1: return "uniqueness";
      case 2: return "values";
      case 3: return "ambition";
      case 4: return "impact";
      default: return "purpose";
    }
  };

  // Current response for this question
  const currentResponse = responses[getResponseKey(currentQuestionIndex)] || "";

  // Check if form is complete
  const isFormComplete = [
    responses.purpose,
    responses.uniqueness,
    responses.values,
    responses.ambition,
    responses.impact
  ].every(response => !!response?.trim());

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <QuestionnaireProgress 
          currentQuestion={currentQuestionIndex}
          totalQuestions={questions.length}
          progressPercentage={progressPercentage}
        />
        
        <QuestionDisplay question={questions[currentQuestionIndex]} />
        
        <QuestionnaireResponse 
          value={currentResponse}
          onChange={handleResponseChange}
          disabled={isGenerating}
        />
      </div>

      <QuestionnaireNavigation 
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={handleSubmit}
        isFirstQuestion={currentQuestionIndex === 0}
        isLastQuestion={currentQuestionIndex === questions.length - 1}
        isFormComplete={isFormComplete}
        isLoading={isGenerating}
      />
    </div>
  );
}
