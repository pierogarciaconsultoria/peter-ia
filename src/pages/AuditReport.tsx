
import ExternalAudit from "./ExternalAudit";

export default function AuditReport() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex flex-col gap-1 mb-6">
            <h1 className="text-3xl font-bold">Relatório de Auditoria</h1>
            <p className="text-muted-foreground">
              Visualize ou registre relatórios das auditorias realizadas
            </p>
          </div>
          <ExternalAudit />
        </div>
      </main>
    </div>
  );
}
