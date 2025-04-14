
import { SelectGroup } from "./SelectGroup";
import { Skeleton } from "@/components/ui/skeleton";

interface EmployeeSelectorProps {
  employeeId: string;
  setEmployeeId: (value: string) => void;
  error?: string;
  employees: Array<{ id: string; name: string; department: string }>;
  isLoading?: boolean;
}

export function EmployeeSelector({ 
  employeeId, 
  setEmployeeId, 
  error, 
  employees,
  isLoading = false
}: EmployeeSelectorProps) {
  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  // Transform employees list into dropdown options
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
