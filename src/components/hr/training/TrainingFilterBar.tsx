
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Search, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface TrainingFilters {
  startDate: Date | null;
  endDate: Date | null;
  department: string;
  employeeId: string;
  procedure: string;
  searchQuery: string;
}

interface TrainingFilterBarProps {
  departments: string[];
  employees: { id: string; name: string; department: string }[];
  procedures: string[];
  onFilterChange: (filters: TrainingFilters) => void;
}

export function TrainingFilterBar({ 
  departments, 
  employees, 
  procedures, 
  onFilterChange 
}: TrainingFilterBarProps) {
  const [filters, setFilters] = useState<TrainingFilters>({
    startDate: null,
    endDate: null,
    department: '',
    employeeId: '',
    procedure: '',
    searchQuery: ''
  });

  const handleFilterChange = <K extends keyof TrainingFilters>(key: K, value: TrainingFilters[K]) => {
    const newFilters = { ...filters, [key]: value };
    
    // Se o departamento mudar, limpar o funcionário selecionado
    if (key === 'department') {
      newFilters.employeeId = '';
    }
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const resetFilters = {
      startDate: null,
      endDate: null,
      department: '',
      employeeId: '',
      procedure: '',
      searchQuery: ''
    };
    
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  // Filtra funcionários por departamento selecionado
  const filteredEmployees = filters.department
    ? employees.filter(emp => emp.department === filters.department)
    : employees;

  return (
    <div className="bg-card rounded-md p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Filtros</h3>
        {Object.values(filters).some(value => value) && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="h-8 px-2"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar filtros
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Período */}
        <div className="space-y-2">
          <Label>Data inicial</Label>
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
                  "Selecione a data"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.startDate || undefined}
                onSelect={(date) => handleFilterChange('startDate', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Data final</Label>
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
                  "Selecione a data"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.endDate || undefined}
                onSelect={(date) => handleFilterChange('endDate', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Departamento */}
        <div className="space-y-2">
          <Label htmlFor="department">Departamento</Label>
          <Select 
            value={filters.department} 
            onValueChange={(value) => handleFilterChange('department', value)}
          >
            <SelectTrigger id="department">
              <SelectValue placeholder="Todos os departamentos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os departamentos</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Colaborador */}
        <div className="space-y-2">
          <Label htmlFor="employee">Colaborador</Label>
          <Select 
            value={filters.employeeId} 
            onValueChange={(value) => handleFilterChange('employeeId', value)}
          >
            <SelectTrigger id="employee">
              <SelectValue placeholder="Todos os colaboradores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os colaboradores</SelectItem>
              {filteredEmployees.map((emp) => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Procedimento */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="procedure">Procedimento</Label>
          <Select 
            value={filters.procedure} 
            onValueChange={(value) => handleFilterChange('procedure', value)}
          >
            <SelectTrigger id="procedure">
              <SelectValue placeholder="Todos os procedimentos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os procedimentos</SelectItem>
              {procedures.map((proc) => (
                <SelectItem key={proc} value={proc}>
                  {proc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Pesquisa */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="search">Pesquisar</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Pesquisar por título, instrutor..."
              className="pl-8"
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
