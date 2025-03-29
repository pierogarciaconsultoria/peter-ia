
import { Action5W2H } from "@/types/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActionKanbanCard } from "../kanban/ActionKanbanCard";

interface ActionsByResponsibleProps {
  actions: Action5W2H[];
  onView: (action: Action5W2H) => void;
  onEdit: (action: Action5W2H) => void;
  onDelete: (action: Action5W2H) => void;
}

export function ActionsByResponsible({ actions, onView, onEdit, onDelete }: ActionsByResponsibleProps) {
  // Group actions by responsible
  const groupedActions: { [key: string]: Action5W2H[] } = {};
  
  actions.forEach(action => {
    if (!groupedActions[action.responsible]) {
      groupedActions[action.responsible] = [];
    }
    groupedActions[action.responsible].push(action);
  });
  
  // Sort responsibles alphabetically
  const sortedResponsibles = Object.keys(groupedActions).sort();

  return (
    <div className="space-y-6 mt-4 pb-6">
      {sortedResponsibles.length > 0 ? (
        sortedResponsibles.map(responsible => (
          <Card key={responsible}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{responsible}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {groupedActions[responsible].map(action => (
                  <ActionKanbanCard 
                    key={action.id} 
                    action={action}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="py-8 text-center text-muted-foreground">
          Nenhuma ação encontrada.
        </div>
      )}
    </div>
  );
}
