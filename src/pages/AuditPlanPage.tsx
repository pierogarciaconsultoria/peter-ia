
import AuditPlan from "./AuditPlan";

export default function AuditPlanPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex flex-col gap-1 mb-6">
            <h1 className="text-3xl font-bold">Plano de Auditoria</h1>
            <p className="text-muted-foreground">
              Elaboração detalhada do plano de auditoria selecionada
            </p>
          </div>
          <AuditPlan />
        </div>
      </main>
    </div>
  );
}
