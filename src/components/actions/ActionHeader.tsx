
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";

type ActionHeaderProps = {
  onAddAction: () => void;
};

export function ActionHeader({ onAddAction }: ActionHeaderProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cronograma de Ação</h1>
        <DialogTrigger asChild>
          <Button onClick={onAddAction}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Ação
          </Button>
        </DialogTrigger>
      </div>
      
      <p className="text-muted-foreground mb-8">
        Acompanhe o cronograma de ações planejadas e monitore o progresso das atividades utilizando a metodologia 5W2H.
      </p>
    </>
  );
}
