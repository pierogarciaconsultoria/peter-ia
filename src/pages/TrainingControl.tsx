
import { Navigation } from "@/components/Navigation";

const TrainingControl = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="md:pl-64 p-6 transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Controle de Treinamentos</h1>
          <p className="text-muted-foreground">
            Gerencie os treinamentos da sua equipe e acompanhe o desenvolvimento de competências.
          </p>
        </div>
      </main>
    </div>
  );
};

export default TrainingControl;
