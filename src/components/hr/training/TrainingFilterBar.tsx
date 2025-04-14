
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Search, X } from "lucide-react";

interface TrainingFilterBarProps {
  departments: string[];
  employees: { id: string; name: string }[];
  procedures: { id: string; title: string; document_type?: string; associated_requirement?: string; created_at?: string; updated_at?: string }[];
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  searchQuery: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  department: string;
  employeeId: string;
  procedure: string;
}

export function TrainingFilterBar({
  departments,
  employees,
  procedures,
  onFilterChange
}: TrainingFilterBarProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    startDate: undefined,
    endDate: undefined,
    department: "",
    employeeId: "",
    procedure: ""
  });

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const resetFilters = {
      searchQuery: "",
      startDate: undefined,
      endDate: undefined,
      department: "",
      employeeId: "",
      procedure: ""
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const hasActiveFilters = () => {
    return (
      filters.searchQuery !== "" ||
      filters.startDate !== undefined ||
      filters.endDate !== undefined ||
      filters.department !== "" ||
      filters.employeeId !== "" ||
      filters.procedure !== ""
    );
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar treinamentos..."
              className="pl-8"
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <Select
                value={filters.department}
                onValueChange={(value) => handleFilterChange("department", value)}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Todos os departamentos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os departamentos</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="employee">Participante</Label>
              <Select
                value={filters.employeeId}
                onValueChange={(value) => handleFilterChange("employeeId", value)}
              >
                <SelectTrigger id="employee">
                  <SelectValue placeholder="Todos os participantes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os participantes</SelectItem>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="procedure">Procedimento</Label>
              <Select
                value={filters.procedure}
                onValueChange={(value) => handleFilterChange("procedure", value)}
              >
                <SelectTrigger id="procedure">
                  <SelectValue placeholder="Todos os procedimentos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os procedimentos</SelectItem>
                  {procedures.map((proc) => (
                    <SelectItem key={proc.id} value={proc.title}>{proc.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Período</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !filters.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.startDate ? (
                        format(filters.startDate, "dd/MM/yyyy")
                      ) : (
                        <span>Data inicial</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.startDate}
                      onSelect={(date) => handleFilterChange("startDate", date)}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !filters.endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.endDate ? (
                        format(filters.endDate, "dd/MM/yyyy")
                      ) : (
                        <span>Data final</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.endDate}
                      onSelect={(date) => handleFilterChange("endDate", date)}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {hasActiveFilters() && (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="flex items-center text-muted-foreground"
              >
                <X className="mr-1 h-4 w-4" />
                Limpar filtros
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
