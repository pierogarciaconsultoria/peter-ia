
interface QuestionnaireProgressProps {
  currentQuestion: number;
  totalQuestions: number;
}

export function QuestionnaireProgress({ currentQuestion, totalQuestions }: QuestionnaireProgressProps) {
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="mb-4">
      <div className="h-2 w-full bg-gray-200 rounded-full">
        <div 
          className="h-full bg-primary rounded-full transition-all" 
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-1 text-sm text-muted-foreground text-right">
        {currentQuestion + 1} de {totalQuestions}
      </div>
    </div>
  );
}
