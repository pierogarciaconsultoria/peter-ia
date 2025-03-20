
import { ActionStatus } from "@/types/actions";

type ActionStatusCardsProps = {
  totalCount: number;
  counts: Record<ActionStatus, number>;
  currentFilter: ActionStatus | "all";
  onFilterChange: (status: ActionStatus | "all") => void;
};

export function ActionStatusCards({ 
  totalCount, 
  counts, 
  currentFilter, 
  onFilterChange 
}: ActionStatusCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
      <div 
        className={`bg-white p-4 rounded-lg border ${currentFilter === "all" ? "border-primary" : "border-gray-200"} shadow-sm cursor-pointer transition-all hover:shadow-md`}
        onClick={() => onFilterChange("all")}
      >
        <h3 className="font-medium text-lg">{totalCount}</h3>
        <p className="text-sm text-muted-foreground">Total</p>
      </div>
      
      <div 
        className={`bg-white p-4 rounded-lg border ${currentFilter === "planned" ? "border-primary" : "border-gray-200"} shadow-sm cursor-pointer transition-all hover:shadow-md`}
        onClick={() => onFilterChange("planned")}
      >
        <h3 className="font-medium text-lg">{counts.planned}</h3>
        <p className="text-sm text-muted-foreground">Planejadas</p>
      </div>
      
      <div 
        className={`bg-white p-4 rounded-lg border ${currentFilter === "in_progress" ? "border-primary" : "border-gray-200"} shadow-sm cursor-pointer transition-all hover:shadow-md`}
        onClick={() => onFilterChange("in_progress")}
      >
        <h3 className="font-medium text-lg">{counts.in_progress}</h3>
        <p className="text-sm text-muted-foreground">Em Andamento</p>
      </div>
      
      <div 
        className={`bg-white p-4 rounded-lg border ${currentFilter === "completed" ? "border-primary" : "border-gray-200"} shadow-sm cursor-pointer transition-all hover:shadow-md`}
        onClick={() => onFilterChange("completed")}
      >
        <h3 className="font-medium text-lg">{counts.completed}</h3>
        <p className="text-sm text-muted-foreground">Concluídas</p>
      </div>
      
      <div 
        className={`bg-white p-4 rounded-lg border ${currentFilter === "delayed" ? "border-primary" : "border-gray-200"} shadow-sm cursor-pointer transition-all hover:shadow-md`}
        onClick={() => onFilterChange("delayed")}
      >
        <h3 className="font-medium text-lg">{counts.delayed}</h3>
        <p className="text-sm text-muted-foreground">Atrasadas</p>
      </div>
    </div>
  );
}
