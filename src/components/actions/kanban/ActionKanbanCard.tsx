
import { Action5W2H, ActionPriority } from "@/types/actions";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ActionKanbanCardProps {
  action: Action5W2H;
  onView: (action: Action5W2H) => void;
  onEdit: (action: Action5W2H) => void;
  onDelete: (action: Action5W2H) => void;
}

export function ActionKanbanCard({ 
  action, 
  onView,
  onEdit,
  onDelete 
}: ActionKanbanCardProps) {
  const getPriorityColor = (priority: ActionPriority) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'high': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="bg-white p-3 rounded-md border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <h4 className="font-medium text-sm line-clamp-2">{action.title}</h4>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(action)}>
              <Eye className="mr-2 h-4 w-4" />
              <span>Visualizar</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(action)}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Editar</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(action)}>
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Excluir</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-2 space-y-2">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className={`${getPriorityColor(action.priority)}`}>
            {action.priority === 'low' && 'Baixa'}
            {action.priority === 'medium' && 'Média'}
            {action.priority === 'high' && 'Alta'}
            {action.priority === 'critical' && 'Crítica'}
          </Badge>
          <Badge variant="outline">{action.process_area}</Badge>
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground">
          <span>Prazo: {formatDate(action.due_date)}</span>
        </div>
        
        <div className="flex items-center text-xs">
          <span className="font-medium">Responsável:</span>
          <span className="ml-1 truncate">{action.responsible}</span>
        </div>
      </div>
    </div>
  );
}
