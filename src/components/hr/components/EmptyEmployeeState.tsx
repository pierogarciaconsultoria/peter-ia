
import { UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewEmployeeDialog } from "../NewEmployeeDialog";

export function EmptyEmployeeState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Users className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Nenhum funcionário cadastrado</h3>
      <p className="text-muted-foreground mb-4 max-w-md">
        Comece adicionando funcionários à sua empresa. Você pode criar perfis completos
        com todas as informações necessárias.
      </p>
      <NewEmployeeDialog
        triggerButton={
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Adicionar Primeiro Funcionário
          </Button>
        }
      />
    </div>
  );
}
