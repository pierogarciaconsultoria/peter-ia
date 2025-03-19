
import { Navigation } from "@/components/Navigation";

const SupplierEvaluation = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="md:pl-64 p-6 transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Avaliação de Fornecedores</h1>
          <p className="text-muted-foreground">
            Avalie, qualifique fornecedores e controle não conformidades relacionadas a fornecedores.
          </p>
        </div>
      </main>
    </div>
  );
};

export default SupplierEvaluation;
