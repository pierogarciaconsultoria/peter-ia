
import { Calendar, User, Clock } from "lucide-react";
import { RequirementDeadline } from "@/utils/isoTypes";

interface RequirementDeadlineInfoProps {
  deadline?: RequirementDeadline;
}

export function RequirementDeadlineInfo({ deadline }: RequirementDeadlineInfoProps) {
  if (!deadline) return null;
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };
  
  return (
    <div className="mt-4 p-4 rounded-md bg-muted/30">
      <h3 className="text-sm font-medium mb-2">Informações de Prazo</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-muted-foreground" />
          <span className="text-sm">
            <strong>Data Alvo:</strong> {formatDate(deadline.targetDate)}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <User size={16} className="text-muted-foreground" />
          <span className="text-sm">
            <strong>Responsável:</strong> {deadline.responsiblePerson}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-muted-foreground" />
          <span className="text-sm">
            <strong>Status:</strong> {
              {
                'not-started': 'Não iniciado',
                'in-progress': 'Em andamento',
                'review': 'Em revisão',
                'completed': 'Concluído',
                'overdue': 'Atrasado'
              }[deadline.status]
            }
          </span>
        </div>
      </div>
    </div>
  );
}
