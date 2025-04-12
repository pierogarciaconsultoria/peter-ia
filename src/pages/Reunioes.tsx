
import { useState } from "react";
import { Users2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

// Importar componentes de reuniões
import { ReunioesHeader } from "@/components/reunioes/ReunioesHeader";
import { ReunioesTabSelect } from "@/components/reunioes/ReunioesTabSelect";
import { ReunioesTabContent } from "@/components/reunioes/ReunioesTabContent";
import { NovaReuniaoDialog } from "@/components/reunioes/NovaReuniaoDialog";

export default function Reunioes() {
  const [activeTab, setActiveTab] = useState("agendadas");
  const [isNovaReuniaoOpen, setIsNovaReuniaoOpen] = useState(false);
  
  return (
    <div className="container py-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Users2 className="mr-2 h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Reuniões</h1>
        </div>
        
        <Dialog open={isNovaReuniaoOpen} onOpenChange={setIsNovaReuniaoOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Reunião
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <NovaReuniaoDialog onSuccess={() => setIsNovaReuniaoOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      <ReunioesHeader activeTab={activeTab} />
      
      <ReunioesTabSelect activeTab={activeTab} onTabChange={setActiveTab} />
      
      <ReunioesTabContent activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
