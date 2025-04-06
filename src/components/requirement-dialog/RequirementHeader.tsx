
import { ISORequirement } from "@/utils/isoRequirements";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { getRequirementDeadline, isOverdue } from "@/utils/isoDeadlines";

interface RequirementHeaderProps {
  requirement: ISORequirement;
}

export function RequirementHeader({ requirement }: RequirementHeaderProps) {
  const deadline = getRequirementDeadline(requirement.number);
  const isDeadlineOverdue = deadline ? isOverdue(deadline) : false;
  
  const getPriorityColor = (priority?: 'low' | 'medium' | 'high' | 'critical') => {
    switch (priority) {
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <DialogHeader>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-medium text-primary px-3 py-0.5 bg-primary/10 rounded-full">
          {requirement.number}
        </span>
        
        {deadline && (
          <Badge variant={isDeadlineOverdue ? "destructive" : "outline"} 
                className={!isDeadlineOverdue ? getPriorityColor(deadline.priority) : ""}>
            {isDeadlineOverdue ? (
              <span className="flex items-center gap-1">
                <AlertTriangle size={12} />
                Atrasado
              </span>
            ) : (
              <span>Prioridade: {deadline.priority}</span>
            )}
          </Badge>
        )}
      </div>
      <DialogTitle className="text-2xl">
        {requirement.title}
      </DialogTitle>
      <DialogDescription className="text-base mt-2">
        {requirement.description}
      </DialogDescription>
    </DialogHeader>
  );
}
