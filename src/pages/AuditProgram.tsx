
import AuditSchedule from "./AuditSchedule";

export default function AuditProgram() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex flex-col gap-1 mb-6">
            <h1 className="text-3xl font-bold">Programa de Auditoria</h1>
            <p className="text-muted-foreground">
              Rotina para planejamento do programa completo de auditorias
            </p>
          </div>
          <AuditSchedule />
        </div>
      </main>
    </div>
  );
}
