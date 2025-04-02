
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface ActionHeaderProps {
  onAddAction: () => void;
  title?: string;
}

export function ActionHeader({ onAddAction, title = "Agenda de Ações" }: ActionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie e acompanhe todas as ações corretivas, preventivas e de melhoria
        </p>
      </div>
      <Button 
        onClick={onAddAction}
        className="mt-4 sm:mt-0"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Nova Ação
      </Button>
    </div>
  );
}
