
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { SelectGroup } from "./components/SelectGroup";
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

  const monthOptions = [
    { value: "all", label: "Todos" },
    { value: "1", label: "Janeiro" },
    { value: "2", label: "Fevereiro" },
    { value: "3", label: "Março" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Maio" },
    { value: "6", label: "Junho" },
    { value: "7", label: "Julho" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" }
  ];

  const yearOptions = [
    { value: "all", label: "Todos" },
    { value: (currentYear - 1).toString(), label: (currentYear - 1).toString() },
    { value: currentYear.toString(), label: currentYear.toString() },
    { value: (currentYear + 1).toString(), label: (currentYear + 1).toString() }
  ];
  
  return (
    <div className="flex flex-wrap items-center gap-2">
      <SelectGroup
        id="filter-month"
        label=""
        value={filter.month?.toString() || "all"}
        onValueChange={(value) => setFilter({ ...filter, month: value === "all" ? undefined : parseInt(value) })}
        placeholder="Mês"
        options={monthOptions}
        className="w-[120px]"
      />
      
      <SelectGroup
        id="filter-year"
        label=""
        value={filter.year?.toString() || "all"}
        onValueChange={(value) => setFilter({ ...filter, year: value === "all" ? undefined : parseInt(value) })}
        placeholder="Ano"
        options={yearOptions}
        className="w-[100px]"
      />
      
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
