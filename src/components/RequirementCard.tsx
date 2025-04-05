
import { ISORequirement } from "@/utils/isoRequirements";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { cn } from "@/lib/utils";
import { ChevronRight, Calendar, AlertTriangle, User } from "lucide-react";
import { getRequirementDeadline, isOverdue } from "@/utils/isoDeadlines";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RequirementCardProps {
  requirement: ISORequirement;
  index: number;
  onClick: (requirement: ISORequirement) => void;
}

export function RequirementCard({ requirement, index, onClick }: RequirementCardProps) {
  const deadline = getRequirementDeadline(requirement.number);
  const isDeadlineOverdue = deadline ? isOverdue(deadline) : false;
  
  // Formatação da data para exibição
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer card-hover appear-animate overflow-hidden",
        "border border-border/40 bg-card/80 backdrop-blur-sm"
      )}
      style={{ "--delay": index } as React.CSSProperties}
      onClick={() => onClick(requirement)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-primary px-2 py-0.5 bg-primary/10 rounded-full">
            {requirement.number}
          </span>
          
          {isDeadlineOverdue && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertTriangle size={12} />
                    <span>Atrasado</span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Prazo expirado em {formatDate(deadline?.targetDate)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {deadline && deadline.priority === 'critical' && !isDeadlineOverdue && (
            <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
              Crítico
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl mt-2">{requirement.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {requirement.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProgressIndicator 
          status={requirement.status} 
          progress={requirement.progress} 
        />
        
        {deadline && (
          <div className="mt-3 flex flex-col gap-1">
            <div className="flex items-center text-xs text-muted-foreground gap-1">
              <Calendar size={12} />
              <span>Prazo: {formatDate(deadline.targetDate)}</span>
            </div>
            
            {deadline.responsiblePerson && (
              <div className="flex items-center text-xs text-muted-foreground gap-1">
                <User size={12} />
                <span>Responsável: {deadline.responsiblePerson}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2 pb-4">
        <span className="text-xs text-muted-foreground">
          {requirement.children?.length || 0} subitems
        </span>
        <ChevronRight size={16} className="text-muted-foreground" />
      </CardFooter>
    </Card>
  );
}
