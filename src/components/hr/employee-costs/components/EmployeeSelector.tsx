
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EmployeeSelectorProps {
  employeeId: string;
  setEmployeeId: (value: string) => void;
  error?: string;
  employees: Array<{ id: string; name: string; department: string }>;
}

export function EmployeeSelector({ employeeId, setEmployeeId, error, employees }: EmployeeSelectorProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="employee">Colaborador</Label>
      <Select value={employeeId} onValueChange={setEmployeeId}>
        <SelectTrigger id="employee" className={error ? "border-red-500" : ""}>
          <SelectValue placeholder="Selecione um colaborador" />
        </SelectTrigger>
        <SelectContent>
          {employees.map(emp => (
            <SelectItem key={emp.id} value={emp.id}>
              {emp.name} - {emp.department}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
