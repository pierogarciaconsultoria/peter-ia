
import { Button } from "@/components/ui/button";
import { Plus, ClipboardList } from "lucide-react";

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
          <span className="text-blue-600 ml-1 hover:underline cursor-pointer" onClick={() => window.location.href = '/'}>
            Requisito ISO 9001:2015: 9.2 - Auditoria Interna
          </span>
        </p>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline"
          onClick={() => window.location.href = '/'}
          className="hidden md:flex"
        >
          <ClipboardList className="mr-2 h-4 w-4" />
          Ver Requisito 9.2
        </Button>
        {onNewAudit && (
          <Button onClick={onNewAudit}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Auditoria
          </Button>
        )}
      </div>
    </div>
  );
};
