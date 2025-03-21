
import { FilterIcon } from "lucide-react";
import { ProcessArea, ActionSource } from "@/types/actions";

type ActionFiltersProps = {
  processFilter: ProcessArea | "all";
  sourceFilter: ActionSource | "all";
  onProcessFilterChange: (filter: ProcessArea | "all") => void;
  onSourceFilterChange: (filter: ActionSource | "all") => void;
  filteredCount: number;
};

export function ActionFilters({ 
  processFilter, 
  sourceFilter,
  onProcessFilterChange, 
  onSourceFilterChange,
  filteredCount 
}: ActionFiltersProps) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <FilterIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">Filtros:</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
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
          
          <select 
            value={sourceFilter}
            onChange={(e) => onSourceFilterChange(e.target.value as ActionSource | "all")}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="all">Todas as origens</option>
            <option value="planning">Planejamento</option>
            <option value="audit">Auditoria</option>
            <option value="non_conformity">Não Conformidade</option>
            <option value="corrective_action">Ação Corretiva</option>
            <option value="critical_analysis">Análise Crítica</option>
            <option value="customer_satisfaction">Pesquisa de Satisfação</option>
            <option value="supplier_evaluation">Avaliação de Fornecedor</option>
            <option value="customer_complaint">Reclamação de Cliente</option>
            <option value="other">Outro</option>
          </select>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground">
        {filteredCount} {filteredCount === 1 ? 'ação encontrada' : 'ações encontradas'}
      </div>
    </div>
  );
}
