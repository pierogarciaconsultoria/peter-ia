
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { RiskManagementDashboard } from "@/components/risks/RiskManagementDashboard";
import { RiskForm } from "@/components/risks/RiskForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const RiskManagement = () => {
  const [addRiskOpen, setAddRiskOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="md:pl-64 p-6 transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Gestão de Riscos</h1>
              <p className="text-muted-foreground mt-1">
                Identifique, avalie e controle os riscos relacionados aos processos da sua organização.
              </p>
            </div>
            <Button onClick={() => setAddRiskOpen(true)} className="ml-auto">
              <Plus className="mr-2 h-4 w-4" />
              Novo Risco
            </Button>
          </div>

          <RiskManagementDashboard />

          <Dialog open={addRiskOpen} onOpenChange={setAddRiskOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Novo Risco</DialogTitle>
                <DialogDescription>
                  Adicione um novo risco para gerenciamento e tratativa.
                </DialogDescription>
              </DialogHeader>
              <RiskForm onSuccess={() => setAddRiskOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
};

export default RiskManagement;
