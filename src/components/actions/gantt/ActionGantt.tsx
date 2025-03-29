
import { Action5W2H } from "@/types/actions";
import { format, differenceInDays, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";

interface ActionGanttProps {
  actions: Action5W2H[];
  onAction: (action: Action5W2H) => void;
}

export function ActionGantt({ actions, onAction }: ActionGanttProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Get current month's date range
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Sort actions by due date
  const sortedActions = [...actions].sort((a, b) => 
    new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
  );

  const getActionStyle = (action: Action5W2H) => {
    // Calculate position and width based on dates
    const startDate = action.start_date ? new Date(action.start_date) : new Date(action.due_date);
    const endDate = new Date(action.due_date);
    
    let backgroundColor = "";
    switch (action.status) {
      case 'planned': backgroundColor = 'bg-blue-500'; break;
      case 'in_progress': backgroundColor = 'bg-yellow-500'; break;
      case 'completed': backgroundColor = 'bg-green-500'; break;
      case 'delayed': backgroundColor = 'bg-red-500'; break;
      case 'cancelled': backgroundColor = 'bg-gray-500'; break;
      default: backgroundColor = 'bg-blue-500';
    }
    
    return {
      backgroundColor,
      width: `${Math.max(differenceInDays(endDate, startDate) + 1, 1) * 40}px`,
    };
  };

  return (
    <Card className="mt-4 p-4 overflow-x-auto">
      <div ref={containerRef} className="min-w-[800px]">
        {/* Header with days */}
        <div className="flex border-b">
          <div className="w-[200px] shrink-0 p-2 font-medium">Ação</div>
          <div className="flex-1 flex">
            {daysInMonth.map((day, i) => (
              <div 
                key={i} 
                className={`w-10 shrink-0 text-center text-xs py-2 ${
                  format(day, 'dd/MM') === format(today, 'dd/MM') ? 'bg-primary/10' : ''
                }`}
              >
                {format(day, 'dd')}
              </div>
            ))}
          </div>
        </div>
        
        {/* Body with actions */}
        <div className="mt-2">
          {sortedActions.map(action => {
            const startDate = action.start_date ? new Date(action.start_date) : new Date(action.due_date);
            const daysFromMonthStart = differenceInDays(startDate, monthStart);
            
            return (
              <div 
                key={action.id} 
                className="flex items-center py-2 border-b border-border/40 hover:bg-muted/50 cursor-pointer"
                onClick={() => onAction(action)}
              >
                <div className="w-[200px] shrink-0 p-2">
                  <div className="font-medium text-sm truncate">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.responsible}</div>
                </div>
                <div className="flex-1 relative h-8">
                  <div 
                    className={`absolute h-6 top-1 rounded-sm ${getActionStyle(action).backgroundColor}`} 
                    style={{
                      left: `${Math.max(daysFromMonthStart, 0) * 40}px`,
                      width: getActionStyle(action).width,
                    }}
                  >
                    <div className="px-2 text-xs text-white truncate w-full h-full flex items-center">
                      {action.title}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {sortedActions.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              Nenhuma ação encontrada para exibir no gráfico Gantt.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
