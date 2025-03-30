
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StrategicIdentityForm } from "@/components/strategic-planning/StrategicIdentityForm";
import { SwotAnalysis } from "@/components/strategic-planning/SwotAnalysis";
import { BalancedScorecard } from "@/components/strategic-planning/BalancedScorecard";
import { BusinessModelCanvas } from "@/components/strategic-planning/BusinessModelCanvas";
import { getStrategicIdentity } from "@/services/strategic-planning/strategicIdentityService";
import { StrategicIdentity } from "@/types/strategic-planning";

const StrategicPlanning = () => {
  const [activeTab, setActiveTab] = useState("identity");
  const [identity, setIdentity] = useState<StrategicIdentity | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchIdentity = async () => {
    setLoading(true);
    try {
      const data = await getStrategicIdentity();
      setIdentity(data);
    } catch (error) {
      console.error("Error fetching strategic identity:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdentity();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="md:pl-64 p-6 transition-all duration-300 flex-1">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Planejamento Estratégico</h1>
            <p className="text-muted-foreground mt-1">
              Defina e acompanhe a estratégia da sua organização
            </p>
          </div>
          
          <Tabs defaultValue="identity" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="identity">Identidade Estratégica</TabsTrigger>
              <TabsTrigger value="swot">Análise SWOT</TabsTrigger>
              <TabsTrigger value="bsc">Balanced Scorecard</TabsTrigger>
              <TabsTrigger value="canvas">Business Model Canvas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="identity">
              {loading ? (
                <p className="text-center text-muted-foreground py-12">Carregando...</p>
              ) : (
                <StrategicIdentityForm
                  identity={identity}
                  onUpdate={fetchIdentity}
                />
              )}
            </TabsContent>
            
            <TabsContent value="swot">
              <SwotAnalysis />
            </TabsContent>
            
            <TabsContent value="bsc">
              <BalancedScorecard />
            </TabsContent>
            
            <TabsContent value="canvas">
              <BusinessModelCanvas />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StrategicPlanning;
