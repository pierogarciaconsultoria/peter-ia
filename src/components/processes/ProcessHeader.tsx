
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, GitBranch } from "lucide-react";

interface ProcessHeaderProps {
  handleNewProcess: () => void;
  handleMacroProcess?: () => void;
}

export function ProcessHeader({ handleNewProcess, handleMacroProcess }: ProcessHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">Processos</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie os processos da sua organização
        </p>
      </div>
      <div className="flex gap-2">
        {handleMacroProcess && (
          <Button variant="outline" onClick={handleMacroProcess}>
            <GitBranch className="mr-2 h-4 w-4" />
            Macro Processo
          </Button>
        )}
        <Button onClick={handleNewProcess}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Processo
        </Button>
      </div>
    </div>
  );
}
