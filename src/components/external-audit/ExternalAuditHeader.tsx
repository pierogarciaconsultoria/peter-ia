
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ExternalAudit } from "@/services/externalAuditService";

interface ExternalAuditHeaderProps {
  onNewAudit: () => void;
  nextAudit: ExternalAudit | null;
  daysRemaining: number | null;
}

export function ExternalAuditHeader({ onNewAudit, nextAudit, daysRemaining }: ExternalAuditHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Auditoria Externa</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie os processos de auditoria externa, programações e resultados
        </p>
      </div>
      
      <div className="flex gap-4 items-center">
        {nextAudit && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded-md text-sm flex items-center">
            <span className="font-medium mr-2">Próxima auditoria:</span> 
            <span>{nextAudit.title}</span>
            {daysRemaining !== null && (
              <span className="ml-2 bg-blue-100 px-2 py-0.5 rounded-full text-xs">
                Em {daysRemaining} {daysRemaining === 1 ? 'dia' : 'dias'}
              </span>
            )}
          </div>
        )}
        <Button onClick={onNewAudit} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Nova Auditoria
        </Button>
      </div>
    </div>
  );
}
