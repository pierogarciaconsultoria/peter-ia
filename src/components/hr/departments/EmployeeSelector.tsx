
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
}

interface EmployeeSelectorProps {
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
}

export function EmployeeSelector({ value, onChange, placeholder = "Selecionar funcionário..." }: EmployeeSelectorProps) {
  const [open, setOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('employees')
          .select('*')
          .eq('status', 'active');
        
        if (error) {
          throw error;
        }
        
        setEmployees(data || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const selectedEmployee = employees.find(emp => emp.id === value);

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
          {value && selectedEmployee
            ? selectedEmployee.name
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Buscar funcionário..." />
          <CommandEmpty>Nenhum funcionário encontrado.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {employees.map((employee) => (
              <CommandItem
                key={employee.id}
                value={employee.name}
                onSelect={() => {
                  onChange(employee.id === value ? null : employee.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === employee.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span>{employee.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {employee.position} • {employee.department}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
