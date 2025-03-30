
import { Building, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface EmptyDepartmentStateProps {
  onAddDepartment: () => void;
  onShowTemplates: () => void;
}

export function EmptyDepartmentState({ 
  onAddDepartment,
  onShowTemplates
}: EmptyDepartmentStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <Building className="h-12 w-12 text-muted-foreground/50 mb-4" />
      <h3 className="text-lg font-medium">Nenhum departamento cadastrado</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4">
        Comece criando um novo departamento para sua empresa
      </p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Departamento
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
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
