
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MacroProcessDiagram } from "@/components/processes/MacroProcessDiagram";
import { Process } from "@/types/processes";

interface MacroProcessDialogProps {
  open: boolean;
  onClose: () => void;
  processes: Process[];
  processType?: string;
}

export function MacroProcessDialog({ open, onClose, processes, processType }: MacroProcessDialogProps) {
  // Filtra os processos por tipo se fornecido
  const filteredProcesses = processType 
    ? processes.filter(process => process.type === processType)
    : processes;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            Diagrama de Macro Processo
            {processType && <span className="ml-2 text-muted-foreground">({processType})</span>}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto py-4">
          <MacroProcessDiagram processes={filteredProcesses} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
