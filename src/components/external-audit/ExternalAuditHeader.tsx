
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface ExternalAuditHeaderProps {
  onNewAudit: () => void;
}

export function ExternalAuditHeader({ onNewAudit }: ExternalAuditHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Auditoria Externa</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie os processos de auditoria externa, programações e resultados
        </p>
      </div>
      <Button onClick={onNewAudit} className="flex items-center gap-2">
        <PlusCircle className="h-4 w-4" />
        Nova Auditoria
      </Button>
    </div>
  );
}
