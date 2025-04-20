
import { Button } from "@/components/ui/button";
import { PlusCircle, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface IndicatorsHeaderProps {
  isStrategicProcess: boolean;
  onCreateIndicator: () => void;
  onGenerateFromStrategy: () => void;
}

export function IndicatorsHeader({ 
  isStrategicProcess, 
  onCreateIndicator, 
  onGenerateFromStrategy 
}: IndicatorsHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">Indicadores de Desempenho</h1>
        <p className="text-muted-foreground mt-1">
          Monitore e gerencie os indicadores de desempenho da organização
        </p>
      </div>
      <div className="flex gap-2">
        {isStrategicProcess && (
          <>
            <Link 
              to="/strategic-planning"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Ver Planejamento Estratégico
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Button variant="outline" onClick={onGenerateFromStrategy} className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Gerar com IA
            </Button>
          </>
        )}
        <Button onClick={onCreateIndicator}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Indicador
        </Button>
      </div>
    </div>
  );
}
