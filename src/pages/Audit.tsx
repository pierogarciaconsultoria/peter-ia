
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuditSchedule from "./AuditSchedule";
import { List, PlusCircle, FileText } from "lucide-react";

export default function AuditUnifiedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        <div className="max-w-5xl mx-auto p-6">
          <div className="flex flex-col gap-1 mb-2">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <List className="h-7 w-7 text-blue-500" />
              Auditoria
            </h1>
            <p className="text-muted-foreground">
              Gerencie todo o ciclo de auditoria: cronograma, planos, execução e relatórios.
            </p>
          </div>

          {/* AÇÕES RÁPIDAS NO TOPO */}
          <div className="flex flex-wrap gap-3 my-6">
            <Button
              variant="default"
              onClick={() => navigate("/audit-plan")}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-5 w-5" />
              Novo Plano de Auditoria
            </Button>
            <Button
              variant="outline"
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
              className="flex items-center gap-2"
            >
              <FileText className="h-5 w-5" />
              Ver Relatórios
            </Button>
          </div>

          {/* CRONOGRAMA/CARDS DE STATUS */}
          <div className="mt-2">
            <AuditSchedule />
          </div>
          {/* Você pode adicionar aqui banners ou cards informativos sobre o processo de auditoria */}
        </div>
      </main>
    </div>
  );
}
