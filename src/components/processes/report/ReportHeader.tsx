
import React from "react";
import { 
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface ReportHeaderProps {
  processName: string;
  onEdit?: () => void;
  canEdit?: boolean;
}

export function ReportHeader({ processName, onEdit, canEdit = false }: ReportHeaderProps) {
  return (
    <DialogHeader className="flex flex-row items-start justify-between">
      <div>
        <DialogTitle className="text-2xl">
          Relatório de Processo: {processName || "Novo Processo"}
        </DialogTitle>
        <DialogDescription>
          Análise detalhada do processo em formato BPMN com recomendações geradas por IA
        </DialogDescription>
      </div>
      {canEdit && onEdit && (
        <Button variant="outline" size="sm" onClick={onEdit} className="flex items-center gap-1">
          <Pencil size={16} />
          <span>Editar</span>
        </Button>
      )}
    </DialogHeader>
  );
}
