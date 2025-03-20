
import { FilterIcon } from "lucide-react";
import { ProcessArea } from "@/types/actions";

type ActionFiltersProps = {
  processFilter: ProcessArea | "all";
  onProcessFilterChange: (filter: ProcessArea | "all") => void;
  filteredCount: number;
};

export function ActionFilters({ 
  processFilter, 
  onProcessFilterChange, 
  filteredCount 
}: ActionFiltersProps) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-2">
        <FilterIcon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">Filtros:</span>
        
        <select 
          value={processFilter}
          onChange={(e) => onProcessFilterChange(e.target.value as ProcessArea | "all")}
          className="text-sm border rounded px-2 py-1"
        >
          <option value="all">Todas as áreas</option>
          <option value="manufacturing">Produção</option>
          <option value="quality">Qualidade</option>
          <option value="management">Gestão</option>
          <option value="hr">Recursos Humanos</option>
          <option value="sales">Vendas</option>
          <option value="supply_chain">Cadeia de Suprimentos</option>
          <option value="other">Outro</option>
        </select>
      </div>
      
      <div className="text-sm text-muted-foreground">
        {filteredCount} {filteredCount === 1 ? 'ação encontrada' : 'ações encontradas'}
      </div>
    </div>
  );
}
