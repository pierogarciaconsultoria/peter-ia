
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCcw } from "lucide-react";
import { ExternalDiscAssessmentLink } from "./ExternalDiscAssessmentLink";

interface DiscAssessmentHeaderProps {
  onOpenDialog: () => void;
  onRefresh: () => Promise<void>;
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
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Avaliação DISC</h2>
        <p className="text-muted-foreground">
          Gerencie avaliações DISC de colaboradores e candidatos
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          onClick={onRefresh}
          disabled={isLoading || isRetrying}
        >
          <RefreshCcw className={`h-4 w-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Atualizando...' : 'Atualizar'}
        </Button>
        
        <ExternalDiscAssessmentLink />
        
        <Button onClick={onOpenDialog}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Nova Avaliação
        </Button>
      </div>
    </div>
  );
}
