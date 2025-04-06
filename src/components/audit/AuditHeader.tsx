
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AuditHeaderProps {
  onNewAudit?: () => void;
}

export const AuditHeader = ({ onNewAudit }: AuditHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold">Auditoria</h1>
        <p className="text-muted-foreground mt-1">
          Planeje e acompanhe o cronograma de auditorias internas da sua organização.
        </p>
      </div>
      {onNewAudit && (
        <Button onClick={onNewAudit}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Auditoria
        </Button>
      )}
    </div>
  );
};
