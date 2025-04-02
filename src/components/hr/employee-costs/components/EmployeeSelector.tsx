
import { SelectGroup } from "./SelectGroup";

interface EmployeeSelectorProps {
  employeeId: string;
  setEmployeeId: (value: string) => void;
  error?: string;
  employees: Array<{ id: string; name: string; department: string }>;
}

export function EmployeeSelector({ employeeId, setEmployeeId, error, employees }: EmployeeSelectorProps) {
  // Transformar a lista de colaboradores em opções para o dropdown
  const employeeOptions = employees.map(emp => ({
    value: emp.id,
    label: `${emp.name} - ${emp.department}`
  }));

  return (
    <SelectGroup
      id="employee"
      label="Colaborador"
      value={employeeId}
      onValueChange={setEmployeeId}
      placeholder="Selecione um colaborador"
      options={employeeOptions}
      error={error}
      className="w-full"
    />
  );
}
