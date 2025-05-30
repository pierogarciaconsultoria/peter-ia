
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Filter } from "lucide-react";
import { TrainingMatrixFilters as Filters } from "@/types/trainingMatrix";

interface TrainingMatrixFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  departments: any[];
  jobPositions: any[];
  employees: any[];
}

export function TrainingMatrixFilters({ 
  filters, 
  onFiltersChange, 
  departments, 
  jobPositions, 
  employees 
}: TrainingMatrixFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof Filters, value: string | boolean | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Limpar Filtros
          </Button>
        )}
      </div>

      {isOpen && (
        <Card>
          <CardHeader>
            <CardTitle>Filtros da Matriz</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Departamento</label>
                <Select 
                  value={filters.department || ""} 
                  onValueChange={(value) => updateFilter('department', value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os departamentos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os departamentos</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Cargo</label>
                <Select 
                  value={filters.jobPosition || ""} 
                  onValueChange={(value) => updateFilter('jobPosition', value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os cargos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os cargos</SelectItem>
                    {jobPositions.map((position) => (
                      <SelectItem key={position.id} value={position.title}>
                        {position.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Status</label>
                <Select 
                  value={filters.status || ""} 
                  onValueChange={(value) => updateFilter('status', value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os status</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="in_progress">Em Andamento</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="overdue">Atrasado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
