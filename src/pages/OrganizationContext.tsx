
import { Navigation } from "@/components/Navigation";

const OrganizationContext = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="md:pl-64 p-6 transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Contexto da Organização</h1>
          <p className="text-muted-foreground">
            Defina e acompanhe o contexto da sua organização, incluindo fatores internos e externos relevantes.
          </p>
        </div>
      </main>
    </div>
  );
};

export default OrganizationContext;
