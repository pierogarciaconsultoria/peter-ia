
import { Building, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyDepartmentStateProps {
  onAddDepartment: () => void;
}

export function EmptyDepartmentState({ onAddDepartment }: EmptyDepartmentStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <Building className="h-12 w-12 text-muted-foreground/50 mb-4" />
      <h3 className="text-lg font-medium">Nenhum departamento cadastrado</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4">
        Começe criando um novo departamento para sua empresa
      </p>
      <Button onClick={onAddDepartment}>
        <Plus className="mr-2 h-4 w-4" />
        Novo Departamento
      </Button>
    </div>
  );
}
