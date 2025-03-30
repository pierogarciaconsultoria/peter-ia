
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

interface RequestHeaderProps {
  onAddRequest: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export function RequestHeader({ onAddRequest, onRefresh, isLoading }: RequestHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">Movimentação de Pessoal</h2>
        <p className="text-muted-foreground">
          Solicitações de contratação, transferência, desligamento e outras demandas para o RH
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
        <Button size="sm" onClick={onAddRequest}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Solicitação
        </Button>
      </div>
    </div>
  );
}
