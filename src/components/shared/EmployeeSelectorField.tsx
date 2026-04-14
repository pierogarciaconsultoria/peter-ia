import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { useActiveEmployees } from "@/hooks/useActiveEmployees";

interface EmployeeSelectorFieldProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function EmployeeSelectorField({ 
  control,
  name,
  label = "Responsável",
  placeholder = "Selecione um colaborador",
  required = false,
  className = ""
}: EmployeeSelectorFieldProps) {
  const { employees, loadingEmployees } = useActiveEmployees();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label} {required && "*"}</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            value={field.value || ""}
            disabled={loadingEmployees}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={loadingEmployees ? "Carregando..." : placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  <div className="flex flex-col">
                    <span>{employee.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {(employee.position || "Sem cargo")} - {(employee.department || "Sem setor")}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
