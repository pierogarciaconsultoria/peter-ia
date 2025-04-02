
import React from "react";
import { GitBranch, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProcessHeaderProps {
  handleNewProcess: () => void;
}

export function ProcessHeader({ handleNewProcess }: ProcessHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center">
          <GitBranch className="mr-2 h-6 w-6" /> Gestão de Processos
        </h1>
        <p className="text-muted-foreground mt-1">
          Mapeie, documente e monitore os processos da organização
        </p>
      </div>
      <Button className="mt-4 md:mt-0" onClick={handleNewProcess}>
        <Plus className="mr-2 h-4 w-4" /> Novo Processo
      </Button>
    </div>
  );
}
