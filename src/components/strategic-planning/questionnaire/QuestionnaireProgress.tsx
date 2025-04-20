
import { Progress } from "@/components/ui/progress";

interface QuestionnaireProgressProps {
  progress: number;
}

export function QuestionnaireProgress({ progress }: QuestionnaireProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Progresso</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
