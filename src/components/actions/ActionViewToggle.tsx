
import { kanban, chartGantt, user } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type ViewFormat = 'table' | 'kanban' | 'gantt' | 'responsible';

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
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
            <rect x="2" y="4" width="6" height="16" rx="1" stroke="currentColor" strokeWidth="2" />
            <rect x="9" y="4" width="6" height="10" rx="1" stroke="currentColor" strokeWidth="2" />
            <rect x="16" y="4" width="6" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
          </svg>
          <span className="ml-1.5">Kanban</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="gantt" aria-label="Visualizar como gráfico Gantt">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
            <path d="M2 5.5H8.5V10.5H2V5.5Z" stroke="currentColor" strokeWidth="2" />
            <path d="M9.5 13.5H16V18.5H9.5V13.5Z" stroke="currentColor" strokeWidth="2" />
            <path d="M17 4.5H22V9.5H17V4.5Z" stroke="currentColor" strokeWidth="2" />
            <line x1="2" y1="21" x2="22" y2="21" stroke="currentColor" strokeWidth="2" />
          </svg>
          <span className="ml-1.5">Gantt</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="responsible" aria-label="Visualizar por responsável">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
            <path d="M7.5 0.875C5.49797 0.875 3.875 2.49797 3.875 4.5C3.875 6.15288 4.98124 7.54738 6.49373 7.98351C5.2997 8.12901 4.27557 8.55134 3.50407 9.31167C2.52216 10.2794 2.02502 11.72 2.02502 13.5999C2.02502 13.8623 2.23769 14.0749 2.50002 14.0749C2.76236 14.0749 2.97502 13.8623 2.97502 13.5999C2.97502 11.8799 3.42786 10.7206 4.17091 9.9883C4.91536 9.25463 6.02674 8.87499 7.49995 8.87499C8.97317 8.87499 10.0846 9.25463 10.8291 9.98831C11.5721 10.7206 12.025 11.8799 12.025 13.5999C12.025 13.8623 12.2376 14.0749 12.5 14.0749C12.7623 14.075 12.975 13.8623 12.975 13.6C12.975 11.72 12.4779 10.2794 11.496 9.3117C10.7245 8.55135 9.70025 8.12903 8.50625 7.98352C10.0187 7.5474 11.125 6.15289 11.125 4.5C11.125 2.49797 9.50203 0.875 7.5 0.875ZM4.825 4.5C4.825 3.02264 6.02264 1.825 7.5 1.825C8.97736 1.825 10.175 3.02264 10.175 4.5C10.175 5.97736 8.97736 7.175 7.5 7.175C6.02264 7.175 4.825 5.97736 4.825 4.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
          </svg>
          <span className="ml-1.5">Responsável</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
