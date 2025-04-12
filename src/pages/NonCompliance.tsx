
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

// Importar componentes de não conformidade
import { NonConformityList } from "@/components/nonconformity/NonConformityList";
import { NonConformityForm } from "@/components/nonconformity/NonConformityForm";
import { NonConformityStats } from "@/components/nonconformity/NonConformityStats";
import { NonConformityChart } from "@/components/nonconformity/NonConformityChart";

export default function NonCompliance() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleNonConformityCreated = () => {
    setIsDialogOpen(false);
    toast({
      title: "Não conformidade registrada",
      description: "A não conformidade foi registrada com sucesso.",
      variant: "success",
    });
  };

  return (
    <div className="container py-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <AlertTriangle className="mr-2 h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Não Conformidades</h1>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Registrar Não Conformidade</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <NonConformityForm onSuccess={handleNonConformityCreated} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NonConformityStats />
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="open">
            Em Aberto <Badge variant="secondary" className="ml-2">12</Badge>
          </TabsTrigger>
          <TabsTrigger value="analysis">Em Análise</TabsTrigger>
          <TabsTrigger value="actions">Com Ação Definida</TabsTrigger>
          <TabsTrigger value="closed">Encerradas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="pt-4">
          <NonConformityList />
        </TabsContent>
        
        <TabsContent value="open" className="pt-4">
          <NonConformityList status="open" />
        </TabsContent>
        
        <TabsContent value="analysis" className="pt-4">
          <NonConformityList status="analysis" />
        </TabsContent>
        
        <TabsContent value="actions" className="pt-4">
          <NonConformityList status="action" />
        </TabsContent>
        
        <TabsContent value="closed" className="pt-4">
          <NonConformityList status="closed" />
        </TabsContent>
      </Tabs>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Análise de Tendências</h2>
        <div className="h-80 bg-card rounded-lg p-4 border">
          <NonConformityChart />
        </div>
      </div>
    </div>
  );
}
