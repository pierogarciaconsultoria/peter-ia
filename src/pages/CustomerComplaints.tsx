
import { Navigation } from "@/components/Navigation";

const CustomerComplaints = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="md:pl-64 p-6 transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Reclamação de Cliente</h1>
          <p className="text-muted-foreground">
            Gerencie as reclamações de clientes e acompanhe o processo de resolução.
          </p>
        </div>
      </main>
    </div>
  );
};

export default CustomerComplaints;
