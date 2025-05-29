import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuestionForm } from "./components/QuestionForm";
import { QuestionnaireProgress } from "./components/QuestionnaireProgress";
import { useDiscQuestionnaire } from "./hooks/useDiscQuestionnaire";
import { discQuestions } from "./data/discQuestions";
import { DiscScore } from "@/types/disc";

interface DiscQuestionnaireFormProps {
  onComplete: (scores: DiscScore) => void;
  onCancel?: () => void;
}

export function DiscQuestionnaireForm({ onComplete, onCancel }: DiscQuestionnaireFormProps) {
  const {
    currentQuestionIndex,
    answers,
    comments,
    setComments,
    handleAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    canComplete,
    handleComplete
  } = useDiscQuestionnaire(onComplete);

  const question = discQuestions[currentQuestionIndex];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Questão {currentQuestionIndex + 1} de {discQuestions.length}</CardTitle>
        </CardHeader>
        <CardContent>
          <QuestionForm
            question={question}
            onAnswer={handleAnswer}
            selectedAnswer={answers[question.id]}
          />
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="secondary"
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Anterior
        </Button>
        <Button
          type="button"
          onClick={goToNextQuestion}
          disabled={currentQuestionIndex === discQuestions.length - 1}
        >
          Próximo
        </Button>
      </div>

      <QuestionnaireProgress
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={discQuestions.length}
      />

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="button" onClick={handleComplete} disabled={!canComplete}>
          Concluir Avaliação
        </Button>
      </div>
    </div>
  );
}
