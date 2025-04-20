import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { QuestionnaireResponse } from "@/components/strategic-planning/questionnaire/QuestionnaireResponse";
import { DiscScore } from "@/hooks/useDiscAssessments";
import { discQuestions } from "./data/discQuestions";
import { QuestionnaireProgress } from "./components/QuestionnaireProgress";
import { QuestionForm } from "./components/QuestionForm";
import { useDiscQuestionnaire } from "./hooks/useDiscQuestionnaire";

interface DiscQuestionnaireFormProps {
  onComplete: (scores: DiscScore) => void;
  onCancel: () => void;
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
  
  const currentQuestion = discQuestions[currentQuestionIndex];
  const totalQuestions = discQuestions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const isAnswered = currentQuestion && answers[currentQuestion.id];

  return (
    <div className="space-y-6">
      <QuestionnaireProgress 
        currentQuestion={currentQuestionIndex} 
        totalQuestions={totalQuestions} 
      />
      
      <QuestionForm
        question={currentQuestion}
        value={answers[currentQuestion.id] || ""}
        onAnswer={(value) => handleAnswer(value, currentQuestion.id)}
      />
      
      {isLastQuestion && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Comentários adicionais (opcional):</h4>
          <QuestionnaireResponse
            value={comments}
            onChange={setComments}
            rows={3}
            placeholder="Adicione qualquer comentário ou observação sobre o avaliado..."
          />
        </div>
      )}
      
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Anterior
        </Button>
        
        {!isLastQuestion ? (
          <Button 
            type="button" 
            onClick={goToNextQuestion} 
            disabled={!isAnswered}
          >
            Próxima
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <div className="space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancelar
            </Button>
            <Button 
              type="button" 
              onClick={handleComplete} 
              disabled={!canComplete}
            >
              Concluir Avaliação
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
