
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDepartments } from "@/hooks/useDepartments";

interface DepartmentSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  showHeadcount?: boolean;
}

export function DepartmentSelector({ 
  value, 
  onValueChange, 
  placeholder = "Selecione um departamento",
  showHeadcount = false
}: DepartmentSelectorProps) {
  const [open, setOpen] = useState(false);
  const { departments, isLoading } = useDepartments();
  
  const selectedDepartment = departments.find(dept => dept.name === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={isLoading}
        >
          {selectedDepartment ? selectedDepartment.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Buscar departamento..." />
          <CommandEmpty>Nenhum departamento encontrado.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {departments.map((department) => (
              <CommandItem
                key={department.id}
                value={department.name}
                onSelect={(currentValue) => {
                  onValueChange(currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === department.name ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span>{department.name}</span>
                  <div className="flex gap-2 items-center">
                    {department.sector && (
                      <span className="text-xs text-muted-foreground">
                        Setor: {department.sector}
                      </span>
                    )}
                    {showHeadcount && department.approved_headcount !== undefined && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {department.current_headcount || 0}/{department.approved_headcount}
                      </span>
                    )}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
