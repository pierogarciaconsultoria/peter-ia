
import { Navigation } from "@/components/Navigation";

const AuditSchedule = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="md:pl-64 p-6 transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Cronograma de Auditoria</h1>
          <p className="text-muted-foreground">
            Planeje e acompanhe o cronograma de auditorias internas da sua organização.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AuditSchedule;
