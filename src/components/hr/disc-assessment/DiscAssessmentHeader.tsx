
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

interface DiscAssessmentHeaderProps {
  onOpenDialog: () => void;
  onRefresh: () => void;
  isRetrying: boolean;
  isLoading: boolean;
}

export function DiscAssessmentHeader({ 
  onOpenDialog, 
  onRefresh, 
  isRetrying, 
  isLoading 
}: DiscAssessmentHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">Avaliação de Perfil DISC</h2>
        <p className="text-muted-foreground">
          Gerencie avaliações DISC para funcionários e candidatos
        </p>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onRefresh}
          disabled={isRetrying || isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
        <Button onClick={onOpenDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Link de Avaliação
        </Button>
      </div>
    </div>
  );
}
