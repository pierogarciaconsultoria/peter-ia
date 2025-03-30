
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Wand2 } from "lucide-react";

interface QuestionnaireNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  isFormComplete: boolean;
  isLoading: boolean;
}

export function QuestionnaireNavigation({
  onPrevious,
  onNext,
  onSubmit,
  isFirstQuestion,
  isLastQuestion,
  isFormComplete,
  isLoading
}: QuestionnaireNavigationProps) {
  return (
    <div className="flex justify-between">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstQuestion || isLoading}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Anterior
      </Button>

      {isLastQuestion ? (
        <Button
          type="button"
          onClick={onSubmit}
          disabled={!isFormComplete || isLoading}
        >
          {isLoading ? (
            "Gerando..."
          ) : (
            <>
              Gerar Identidade
              <Wand2 className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNext}
          disabled={isLoading}
        >
          Próximo
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
