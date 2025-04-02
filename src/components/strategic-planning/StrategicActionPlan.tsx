
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { StrategicIdentity } from "@/types/strategic-planning";
import { SwotItem } from "@/types/strategic-planning";
import { BscPerspective } from "@/types/strategic-planning";
import { getStrategicIdentity } from "@/services/strategic-planning/strategicIdentityService";
import { getSwotItems } from "@/services/strategic-planning/swotService";
import { getBscPerspectives } from "@/services/strategic-planning/bscService";

export function StrategicActionPlan() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [identity, setIdentity] = useState<StrategicIdentity | null>(null);
  const [swotItems, setSwotItems] = useState<SwotItem[]>([]);
  const [bscPerspectives, setBscPerspectives] = useState<BscPerspective[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all strategic planning data
        const [identityData, swotData, bscData] = await Promise.all([
          getStrategicIdentity(),
          getSwotItems(),
          getBscPerspectives()
        ]);
        
        setIdentity(identityData);
        setSwotItems(swotData);
        setBscPerspectives(bscData);
      } catch (error) {
        console.error("Error fetching strategic planning data:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados do planejamento estratégico",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const navigateToActionSchedule = (pilar: string, type: string) => {
    // Navigate to action schedule with query params to pre-fill form
    navigate(`/action-schedule?source=planning&pilar=${pilar}&type=${type}`);
  };

  if (loading) {
    return (
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold">Plano de Ação Estratégico</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-12">Carregando...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">Plano de Ação Estratégico</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Mission, Vision, Values Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Identidade Estratégica</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Missão</h4>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                  {identity?.mission ? identity.mission : "Não definida"}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigateToActionSchedule("Missão", "identity")}
                >
                  <PlusCircle className="h-4 w-4 mr-2" /> 
                  Criar ação
                </Button>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Visão</h4>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                  {identity?.vision ? identity.vision : "Não definida"}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigateToActionSchedule("Visão", "identity")}
                >
                  <PlusCircle className="h-4 w-4 mr-2" /> 
                  Criar ação
                </Button>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Valores</h4>
                <div className="text-sm text-muted-foreground mb-3 line-clamp-3">
                  {identity?.values && identity.values.length > 0 
                    ? identity.values.join(", ") 
                    : "Não definidos"}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigateToActionSchedule("Valores", "identity")}
                >
                  <PlusCircle className="h-4 w-4 mr-2" /> 
                  Criar ação
                </Button>
              </div>
            </div>
          </div>
          
          {/* SWOT Analysis Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Análise SWOT</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Strengths */}
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Forças</h4>
                <ul className="text-sm text-muted-foreground mb-3 list-disc pl-5 space-y-1 max-h-32 overflow-y-auto">
                  {swotItems.filter(item => item.category === 'strength').length > 0 ? (
                    swotItems
                      .filter(item => item.category === 'strength')
                      .map(item => (
                        <li key={item.id} className="line-clamp-2">
                          {item.description}
                        </li>
                      ))
                  ) : (
                    <li>Nenhuma força identificada</li>
                  )}
                </ul>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigateToActionSchedule("Forças", "swot")}
                >
                  <PlusCircle className="h-4 w-4 mr-2" /> 
                  Criar ação
                </Button>
              </div>
              
              {/* Weaknesses */}
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Fraquezas</h4>
                <ul className="text-sm text-muted-foreground mb-3 list-disc pl-5 space-y-1 max-h-32 overflow-y-auto">
                  {swotItems.filter(item => item.category === 'weakness').length > 0 ? (
                    swotItems
                      .filter(item => item.category === 'weakness')
                      .map(item => (
                        <li key={item.id} className="line-clamp-2">
                          {item.description}
                        </li>
                      ))
                  ) : (
                    <li>Nenhuma fraqueza identificada</li>
                  )}
                </ul>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigateToActionSchedule("Fraquezas", "swot")}
                >
                  <PlusCircle className="h-4 w-4 mr-2" /> 
                  Criar ação
                </Button>
              </div>
              
              {/* Opportunities */}
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Oportunidades</h4>
                <ul className="text-sm text-muted-foreground mb-3 list-disc pl-5 space-y-1 max-h-32 overflow-y-auto">
                  {swotItems.filter(item => item.category === 'opportunity').length > 0 ? (
                    swotItems
                      .filter(item => item.category === 'opportunity')
                      .map(item => (
                        <li key={item.id} className="line-clamp-2">
                          {item.description}
                        </li>
                      ))
                  ) : (
                    <li>Nenhuma oportunidade identificada</li>
                  )}
                </ul>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigateToActionSchedule("Oportunidades", "swot")}
                >
                  <PlusCircle className="h-4 w-4 mr-2" /> 
                  Criar ação
                </Button>
              </div>
              
              {/* Threats */}
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Ameaças</h4>
                <ul className="text-sm text-muted-foreground mb-3 list-disc pl-5 space-y-1 max-h-32 overflow-y-auto">
                  {swotItems.filter(item => item.category === 'threat').length > 0 ? (
                    swotItems
                      .filter(item => item.category === 'threat')
                      .map(item => (
                        <li key={item.id} className="line-clamp-2">
                          {item.description}
                        </li>
                      ))
                  ) : (
                    <li>Nenhuma ameaça identificada</li>
                  )}
                </ul>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigateToActionSchedule("Ameaças", "swot")}
                >
                  <PlusCircle className="h-4 w-4 mr-2" /> 
                  Criar ação
                </Button>
              </div>
            </div>
          </div>
          
          {/* BSC Perspectives Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Balanced Scorecard</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bscPerspectives.length > 0 ? (
                bscPerspectives.map(perspective => {
                  // Map perspective type to Portuguese name
                  const perspectiveNames = {
                    financial: 'Financeira',
                    customer: 'Clientes',
                    internal_process: 'Processos Internos',
                    learning_growth: 'Aprendizado e Crescimento'
                  };
                  const perspectiveName = perspectiveNames[perspective.perspective as keyof typeof perspectiveNames];
                  
                  return (
                    <div key={perspective.id} className="bg-muted/30 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Perspectiva {perspectiveName}</h4>
                      
                      {perspective.objectives && perspective.objectives.length > 0 ? (
                        <ul className="text-sm text-muted-foreground mb-3 list-disc pl-5 space-y-1 max-h-32 overflow-y-auto">
                          {perspective.objectives.map(objective => (
                            <li key={objective.id} className="line-clamp-2">
                              {objective.title}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground mb-3">
                          Nenhum objetivo definido
                        </p>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => navigateToActionSchedule(`BSC - ${perspectiveName}`, "bsc")}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" /> 
                        Criar ação
                      </Button>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-2 text-center text-muted-foreground py-4">
                  Nenhuma perspectiva BSC definida
                </div>
              )}
            </div>
          </div>
          
          {/* Action Plan Button */}
          <div className="flex justify-center pt-4">
            <Button 
              onClick={() => navigate('/action-schedule')}
              size="lg"
              className="gap-2"
            >
              Ir para o Plano de Ação Completo
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
