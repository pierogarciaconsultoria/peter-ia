
import React, { useState, useEffect } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Check, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface ProcessActorSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function ProcessActorSelector({ value, onChange, placeholder = "Selecionar responsável..." }: ProcessActorSelectorProps) {
  const [open, setOpen] = useState(false);
  const [employees, setEmployees] = useState<{ id: string; name: string; department: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEmployees() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('employees')
          .select('id, name, department')
          .eq('status', 'active')
          .order('name');

        if (error) {
          throw error;
        }

        setEmployees(data || []);
      } catch (error) {
        console.error("Error loading employees:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEmployees();
  }, []);

  const selectedEmployee = employees.find(emp => emp.name === value || emp.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={loading}
        >
          <div className="flex items-center">
            {loading ? (
              <span className="text-muted-foreground">Carregando colaboradores...</span>
            ) : selectedEmployee ? (
              <span>{selectedEmployee.name}</span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[300px] max-h-[400px] overflow-auto">
        <Command>
          <CommandInput placeholder="Buscar colaborador..." className="h-9" />
          <CommandEmpty>Nenhum colaborador encontrado.</CommandEmpty>
          <CommandGroup>
            {employees.map((employee) => (
              <CommandItem
                key={employee.id}
                value={employee.name}
                onSelect={() => {
                  onChange(employee.name);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === employee.name ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span>{employee.name}</span>
                  <span className="text-xs text-muted-foreground">{employee.department}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
