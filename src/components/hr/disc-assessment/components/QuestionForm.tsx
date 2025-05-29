
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { DiscQuestion } from "../data/discQuestions";

interface QuestionFormProps {
  question: DiscQuestion;
  selectedAnswer: string;
  onAnswer: (value: string, questionId: string) => void;
}

export function QuestionForm({ question, selectedAnswer, onAnswer }: QuestionFormProps) {
  return (
    <div className="py-2">
      <h3 className="text-lg font-medium mb-4">{question.question}</h3>
      
      <RadioGroup 
        value={selectedAnswer}
        onValueChange={(value) => onAnswer(value, question.id)}
        className="space-y-3"
      >
        {question.options.map(option => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem id={option.value} value={option.value} />
            <Label htmlFor={option.value} className="cursor-pointer">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
