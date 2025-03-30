
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { BscPerspective } from "@/types/strategic-planning";
import { getBscPerspectives } from "@/services/strategicPlanningService";
import { BscObjectiveForm } from "./BscObjectiveForm";
import { BscObjectiveCard } from "./BscObjectiveCard";

export function BalancedScorecard() {
  const [perspectives, setPerspectives] = useState<BscPerspective[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('financial');
  const [showObjectiveDialog, setShowObjectiveDialog] = useState(false);
  
  const perspectiveLabels = {
    financial: "Financeira",
    customer: "Clientes",
    internal_process: "Processos Internos",
    learning_growth: "Aprendizado e Crescimento"
  };

  const fetchPerspectives = async () => {
    setLoading(true);
    try {
      const data = await getBscPerspectives();
      setPerspectives(data);
    } catch (error) {
      console.error("Error fetching BSC perspectives:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerspectives();
  }, []);

  const getPerspectiveForTab = () => {
    return perspectives.find(p => p.perspective === activeTab) || {
      id: "",
      perspective: activeTab as any,
      objectives: [],
      created_at: "",
      updated_at: ""
    };
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">Balanced Scorecard (BSC)</CardTitle>
          <Dialog open={showObjectiveDialog} onOpenChange={setShowObjectiveDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                Adicionar Objetivo
                <PlusCircle size={16} className="ml-1" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Adicionar novo objetivo</DialogTitle>
                <DialogDescription>
                  Defina um objetivo estratégico para a perspectiva {perspectiveLabels[activeTab as keyof typeof perspectiveLabels]}.
                </DialogDescription>
              </DialogHeader>
              <BscObjectiveForm
                perspective={activeTab as any}
                onSaved={() => {
                  fetchPerspectives();
                  setShowObjectiveDialog(false);
                }}
                onCancel={() => setShowObjectiveDialog(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="financial">Financeira</TabsTrigger>
            <TabsTrigger value="customer">Clientes</TabsTrigger>
            <TabsTrigger value="internal_process">Processos</TabsTrigger>
            <TabsTrigger value="learning_growth">Aprendizado</TabsTrigger>
          </TabsList>
          
          {Object.keys(perspectiveLabels).map(perspective => (
            <TabsContent key={perspective} value={perspective}>
              <div className="grid gap-4 mt-4">
                {loading ? (
                  <p className="text-center text-muted-foreground py-8">Carregando...</p>
                ) : getPerspectiveForTab().objectives && getPerspectiveForTab().objectives.length > 0 ? (
                  getPerspectiveForTab().objectives.map(objective => (
                    <BscObjectiveCard 
                      key={objective.id} 
                      objective={objective} 
                      onUpdated={fetchPerspectives} 
                    />
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <p>Nenhum objetivo definido para esta perspectiva.</p>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowObjectiveDialog(true)} 
                      className="mt-4"
                    >
                      Adicionar Objetivo
                      <PlusCircle size={16} className="ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
