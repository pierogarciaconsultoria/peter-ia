
import { Button } from "@/components/ui/button";

interface ProcessSelectorProps {
  selectedProcess: string | null;
  uniqueProcesses: string[];
  processIndicators: any[];
  onPrevProcess: () => void;
  onNextProcess: () => void;
}

export function ProcessSelector({ 
  selectedProcess, 
  uniqueProcesses, 
  processIndicators,
  onPrevProcess,
  onNextProcess 
}: ProcessSelectorProps) {
  if (!uniqueProcesses.length) {
    return (
      <div className="bg-muted p-6 rounded-lg text-center mb-6">
        <p className="text-muted-foreground">
          Nenhum processo com indicadores encontrado. Crie um novo indicador ou adicione indicadores a um processo.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
        <Button 
          variant="ghost" 
          onClick={onPrevProcess}
          disabled={uniqueProcesses.length <= 1}
        >
          &lt;
        </Button>
        
        <div className="text-center">
          <h2 className="text-xl font-semibold">{selectedProcess}</h2>
          <p className="text-sm text-muted-foreground">
            {processIndicators.length} indicadores
          </p>
        </div>
        
        <Button 
          variant="ghost" 
          onClick={onNextProcess}
          disabled={uniqueProcesses.length <= 1}
        >
          &gt;
        </Button>
      </div>
    </div>
  );
}
