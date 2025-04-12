
import { Kanban, ChartGantt, User } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ViewFormat } from "@/hooks/useActionSchedule";

interface ActionViewToggleProps {
  viewFormat: ViewFormat;
  onViewFormatChange: (format: ViewFormat) => void;
}

export function ActionViewToggle({ viewFormat, onViewFormatChange }: ActionViewToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-muted-foreground mr-2">Visualizar:</span>
      <ToggleGroup type="single" value={viewFormat} onValueChange={(value) => value && onViewFormatChange(value as ViewFormat)}>
        <ToggleGroupItem value="table" aria-label="Visualizar como tabela">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
            <path d="M2 3C2 2.44772 2.44772 2 3 2H12C12.5523 2 13 2.44772 13 3V12C13 12.5523 12.5523 13 12 13H3C2.44772 13 2 12.5523 2 12V3ZM3 3H12V5H3V3ZM3 6H12V9H3V6ZM3 10H12V12H3V10Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
          </svg>
          <span className="ml-1.5">Tabela</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="kanban" aria-label="Visualizar como kanban">
          <Kanban className="h-4 w-4" />
          <span className="ml-1.5">Kanban</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="gantt" aria-label="Visualizar como gráfico Gantt">
          <ChartGantt className="h-4 w-4" />
          <span className="ml-1.5">Gantt</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="responsible" aria-label="Visualizar por responsável">
          <User className="h-4 w-4" />
          <span className="ml-1.5">Responsável</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
