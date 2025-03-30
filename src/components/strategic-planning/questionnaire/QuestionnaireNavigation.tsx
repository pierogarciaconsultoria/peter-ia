
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, ArrowRight, ThumbsUp } from "lucide-react";

interface QuestionnaireNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  isGenerating: boolean;
}

export function QuestionnaireNavigation({ 
  onPrevious, 
  onNext, 
  isFirstQuestion, 
  isLastQuestion, 
  isGenerating 
}: QuestionnaireNavigationProps) {
  return (
    <div className="flex justify-between pt-2">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstQuestion || isGenerating}
      >
        Anterior
      </Button>
      
      <Button
        type="button"
        onClick={onNext}
        disabled={isGenerating}
        className={cn(
          isLastQuestion ? "bg-green-600 hover:bg-green-700" : ""
        )}
      >
        {isLastQuestion ? (
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
  );
}
