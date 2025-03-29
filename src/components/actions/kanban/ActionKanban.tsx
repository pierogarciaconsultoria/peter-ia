
import { Action5W2H } from "@/types/actions";
import { ActionKanbanColumn } from "./ActionKanbanColumn";

interface ActionKanbanProps {
  actions: Action5W2H[];
  onView: (action: Action5W2H) => void;
  onEdit: (action: Action5W2H) => void;
  onDelete: (action: Action5W2H) => void;
}

export function ActionKanban({ actions, onView, onEdit, onDelete }: ActionKanbanProps) {
  // Group actions by status
  const plannedActions = actions.filter(action => action.status === 'planned');
  const inProgressActions = actions.filter(action => action.status === 'in_progress');
  const completedActions = actions.filter(action => action.status === 'completed');
  const delayedActions = actions.filter(action => action.status === 'delayed');
  const cancelledActions = actions.filter(action => action.status === 'cancelled');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4 pb-6">
      <ActionKanbanColumn 
        title="Planejadas" 
        count={plannedActions.length} 
        actions={plannedActions} 
        status="planned"
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      <ActionKanbanColumn 
        title="Em Andamento" 
        count={inProgressActions.length} 
        actions={inProgressActions} 
        status="in_progress"
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      <ActionKanbanColumn 
        title="Concluídas" 
        count={completedActions.length} 
        actions={completedActions} 
        status="completed"
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      <ActionKanbanColumn 
        title="Atrasadas" 
        count={delayedActions.length} 
        actions={delayedActions} 
        status="delayed"
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      <ActionKanbanColumn 
        title="Canceladas" 
        count={cancelledActions.length} 
        actions={cancelledActions} 
        status="cancelled"
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}
