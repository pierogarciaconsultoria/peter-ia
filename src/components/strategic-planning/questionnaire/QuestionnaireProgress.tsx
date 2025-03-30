
import React from "react";

interface QuestionnaireProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  progressPercentage: number;
}

export function QuestionnaireProgress({ 
  currentQuestion, 
  totalQuestions, 
  progressPercentage 
}: QuestionnaireProgressProps) {
  return (
    <>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Pergunta {currentQuestion + 1} de {totalQuestions}
      </p>
    </>
  );
}
