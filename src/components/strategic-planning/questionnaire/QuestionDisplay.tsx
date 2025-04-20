
import { Badge } from "@/components/ui/badge";

interface QuestionDisplayProps {
  question: string;
  section: string;
  questionNumber: number;
  totalQuestions: number;
}

export function QuestionDisplay({ 
  question, 
  section, 
  questionNumber, 
  totalQuestions 
}: QuestionDisplayProps) {
  const sectionLabel = 
    section === "mission" ? "Missão" : 
    section === "vision" ? "Visão" : 
    "Valores";
    
  const sectionColor = 
    section === "mission" ? "bg-blue-100 text-blue-800" : 
    section === "vision" ? "bg-purple-100 text-purple-800" : 
    "bg-green-100 text-green-800";

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        <Badge 
          className={sectionColor}
          variant="outline"
        >
          {sectionLabel}
        </Badge>
        <Badge variant="outline">
          Pergunta {questionNumber} de {totalQuestions}
        </Badge>
      </div>
      <h3 className="text-lg font-medium mb-2">{question}</h3>
    </div>
  );
}
