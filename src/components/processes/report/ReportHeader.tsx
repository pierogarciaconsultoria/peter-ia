
import React from "react";
import { 
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ReportHeaderProps {
  processName: string;
}

export function ReportHeader({ processName }: ReportHeaderProps) {
  return (
    <DialogHeader>
      <DialogTitle className="text-2xl">
        Relatório de Processo: {processName || "Novo Processo"}
      </DialogTitle>
      <DialogDescription>
        Análise detalhada do processo em formato BPMN com recomendações geradas por IA
      </DialogDescription>
    </DialogHeader>
  );
}
