
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useActiveEmployees } from "@/hooks/useActiveEmployees";

interface EmployeeSelectorProps {
  employeeId: string;
  setEmployeeId: (value: string) => void;
  field?: any;
  form?: any;
  name?: string;
  required?: boolean;
  label?: string;
}

export function EmployeeSelector({ 
  employeeId, 
  setEmployeeId, 
  field, 
  form, 
  name = "employee_id",
  required = false,
  label = "Funcionário"
}: EmployeeSelectorProps) {
  void field;
  void form;
  void name;

  const { employees, loadingEmployees } = useActiveEmployees();

  return (
    <FormItem>
      <FormLabel>{label} {required && "*"}</FormLabel>
      <Select 
        onValueChange={setEmployeeId} 
        value={employeeId}
        disabled={loadingEmployees}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder={loadingEmployees ? "Carregando..." : "Selecione um funcionário"} />
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
  );
}
