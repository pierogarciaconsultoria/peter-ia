
import { Navigation } from "@/components/Navigation";

const ActionSchedule = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="md:pl-64 p-6 transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Cronograma de Ação</h1>
          <p className="text-muted-foreground">
            Acompanhe o cronograma de ações planejadas e monitore o progresso das atividades.
          </p>
        </div>
      </main>
    </div>
  );
};

export default ActionSchedule;
