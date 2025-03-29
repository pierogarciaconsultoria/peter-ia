
import { ActionStatus, Action5W2H } from "@/types/actions";
import { ActionKanbanCard } from "./ActionKanbanCard";

interface ActionKanbanColumnProps {
  title: string;
  count: number;
  actions: Action5W2H[];
  status: ActionStatus;
  onView: (action: Action5W2H) => void;
  onEdit: (action: Action5W2H) => void;
  onDelete: (action: Action5W2H) => void;
}

export function ActionKanbanColumn({ 
  title, 
  count, 
  actions,
  status,
  onView,
  onEdit,
  onDelete 
}: ActionKanbanColumnProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'planned': return 'bg-blue-100 border-blue-300';
      case 'in_progress': return 'bg-yellow-100 border-yellow-300';
      case 'completed': return 'bg-green-100 border-green-300';
      case 'delayed': return 'bg-red-100 border-red-300';
      case 'cancelled': return 'bg-gray-100 border-gray-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className={`flex flex-col rounded-md border ${getStatusColor()}`}>
      <div className="p-3 border-b border-inherit">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-sm">{title}</h3>
          <span className="inline-flex items-center justify-center w-6 h-6 bg-white rounded-full text-xs">
            {count}
          </span>
        </div>
      </div>
      <div className="flex-1 p-2 overflow-y-auto max-h-[calc(100vh-300px)]">
        <div className="space-y-2">
          {actions.map((action) => (
            <ActionKanbanCard 
              key={action.id} 
              action={action} 
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
          {actions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Nenhuma ação
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
