
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DepartmentHeaderProps {
  onAddDepartment: () => void;
}

export function DepartmentHeader({ onAddDepartment }: DepartmentHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Departamentos</h2>
        <p className="text-muted-foreground">
          Gerencie os departamentos da sua empresa
        </p>
      </div>
      <Button onClick={onAddDepartment}>
        <Plus className="mr-2 h-4 w-4" />
        Novo Departamento
      </Button>
    </div>
  );
}
