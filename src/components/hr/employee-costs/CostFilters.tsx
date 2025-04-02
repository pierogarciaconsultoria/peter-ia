
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmployeeCostFilter } from "./types";
import { FilterX } from 'lucide-react';

interface CostFiltersProps {
  onFilterChange: (filter: EmployeeCostFilter) => void;
}

export function CostFilters({ onFilterChange }: CostFiltersProps) {
  const [filter, setFilter] = useState<EmployeeCostFilter>({});
  const currentYear = new Date().getFullYear();
  
  useEffect(() => {
    onFilterChange(filter);
  }, [filter, onFilterChange]);
  
  const handleReset = () => {
    setFilter({});
  };
  
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={filter.month?.toString() || ""}
        onValueChange={(value) => setFilter({ ...filter, month: value ? parseInt(value) : undefined })}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Mês" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todos</SelectItem>
          <SelectItem value="1">Janeiro</SelectItem>
          <SelectItem value="2">Fevereiro</SelectItem>
          <SelectItem value="3">Março</SelectItem>
          <SelectItem value="4">Abril</SelectItem>
          <SelectItem value="5">Maio</SelectItem>
          <SelectItem value="6">Junho</SelectItem>
          <SelectItem value="7">Julho</SelectItem>
          <SelectItem value="8">Agosto</SelectItem>
          <SelectItem value="9">Setembro</SelectItem>
          <SelectItem value="10">Outubro</SelectItem>
          <SelectItem value="11">Novembro</SelectItem>
          <SelectItem value="12">Dezembro</SelectItem>
        </SelectContent>
      </Select>
      
      <Select
        value={filter.year?.toString() || ""}
        onValueChange={(value) => setFilter({ ...filter, year: value ? parseInt(value) : undefined })}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Ano" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todos</SelectItem>
          <SelectItem value={(currentYear - 1).toString()}>{currentYear - 1}</SelectItem>
          <SelectItem value={currentYear.toString()}>{currentYear}</SelectItem>
          <SelectItem value={(currentYear + 1).toString()}>{currentYear + 1}</SelectItem>
        </SelectContent>
      </Select>
      
      {(filter.month || filter.year) && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleReset}
          className="h-9 w-9"
          title="Limpar filtros"
        >
          <FilterX size={16} />
        </Button>
      )}
    </div>
  );
}
