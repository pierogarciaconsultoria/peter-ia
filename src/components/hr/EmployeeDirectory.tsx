
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { NewEmployeeDialog } from "./NewEmployeeDialog";
import { useEmployees } from "@/hooks/useEmployees";
import { EmployeeTable } from "./components/EmployeeTable";

export function EmployeeDirectory() {
  const { employees, loading, formatDate } = useEmployees();

  return (
    <div className="space-y-4">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-medium">Funcionários</h3>
        <NewEmployeeDialog triggerButton={
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Novo Funcionário
          </Button>
        } />
      </div>
      
      <EmployeeTable 
        employees={employees} 
        formatDate={formatDate}
        isLoading={loading}
      />
    </div>
  );
}
