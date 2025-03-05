
import { CheckCircle2, Clock, AlertCircle, CheckCircle, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ISOTask } from "@/utils/isoTemplates";

interface TaskItemProps {
  task: ISOTask;
}

export function TaskItem({ task }: TaskItemProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'not-started':
        return <Circle className="text-muted-foreground" size={18} />;
      case 'in-progress':
        return <Clock className="text-blue-500" size={18} />;
      case 'review':
        return <AlertCircle className="text-amber-500" size={18} />;
      case 'completed':
        return <CheckCircle className="text-green-500" size={18} />;
      default:
        return <Circle className="text-muted-foreground" size={18} />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'not-started':
        return 'Não iniciada';
      case 'in-progress':
        return 'Em andamento';
      case 'review':
        return 'Em revisão';
      case 'completed':
        return 'Concluída';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <div className="flex items-start p-3 rounded-lg border border-border/40 bg-card/50 hover:bg-card/80 transition-colors">
      <div className="flex-shrink-0 mr-3 mt-1">
        {getStatusIcon(task.status)}
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-medium text-sm">{task.title}</h4>
            <span className="text-xs text-muted-foreground inline-block mt-0.5">
              {getStatusLabel(task.status)}
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {task.description}
        </p>
      </div>
      <div className="ml-2">
        <Button variant="outline" size="sm" className="h-7 text-xs">
          <CheckCircle2 size={14} className="mr-1" />
          Atualizar
        </Button>
      </div>
    </div>
  );
}
