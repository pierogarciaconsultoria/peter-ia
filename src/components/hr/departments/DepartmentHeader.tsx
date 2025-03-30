
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface DepartmentHeaderProps {
  onAddDepartment: () => void;
  onShowTemplates: () => void;
}

export function DepartmentHeader({ 
  onAddDepartment, 
  onShowTemplates 
}: DepartmentHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Departamentos</h2>
        <p className="text-muted-foreground">
          Gerencie os departamentos da sua empresa
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Departamento
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onAddDepartment}>
            Criar do zero
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onShowTemplates}>
            Usar modelos pré-definidos
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
