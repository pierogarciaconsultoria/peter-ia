
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface QuestionnaireResponseProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
}

export function QuestionnaireResponse({ 
  value, 
  onChange, 
  onNext, 
  onPrevious,
  isFirstQuestion,
  isLastQuestion
}: QuestionnaireResponseProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+Enter ou Cmd+Enter para avançar
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      if (value.trim()) {
        onNext();
      }
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Digite sua resposta aqui..."
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        rows={4}
        className="w-full resize-none"
      />
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isFirstQuestion}
          className="flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </Button>
        
        <Button
          onClick={onNext}
          disabled={!value.trim()}
          className="flex items-center"
        >
          {!isLastQuestion ? (
            <>
              Próxima
              <ChevronRight className="h-4 w-4 ml-1" />
            </>
          ) : (
            "Concluir"
          )}
        </Button>
      </div>
    </div>
  );
}
