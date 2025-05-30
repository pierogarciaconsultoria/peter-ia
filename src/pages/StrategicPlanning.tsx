
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StrategicIdentityForm } from "@/components/strategic-planning/StrategicIdentityForm";
import { SwotAnalysis } from "@/components/strategic-planning/SwotAnalysis";
import { BalancedScorecard } from "@/components/strategic-planning/BalancedScorecard";
import { BusinessModelCanvas } from "@/components/strategic-planning/BusinessModelCanvas";
import { StrategicActionPlan } from "@/components/strategic-planning/StrategicActionPlan";
import { getStrategicIdentity } from "@/services/strategic-planning/strategicIdentityService";
import { getSwotItems } from "@/services/strategic-planning/swotService";
import { getBscPerspectives } from "@/services/strategic-planning/bscService";
import { getBusinessModelCanvas } from "@/services/strategicPlanningService";
import { exportStrategicPlanningToPDF } from "@/components/strategic-planning/utils/pdf-export";
import { StrategicIdentity } from "@/types/strategic-planning";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthenticationRequired } from "@/components/auth/AuthenticationRequired";

const StrategicPlanning = () => {
  const { tab } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(tab || "identity");
  const [identity, setIdentity] = useState<StrategicIdentity | null>(null);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);

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

  // Update URL when tab changes
  useEffect(() => {
    if (tab !== activeTab) {
      navigate(`/strategic-planning/${activeTab === "identity" ? "" : activeTab}`, { replace: true });
    }
  }, [activeTab, navigate, tab]);

  // Set active tab based on URL param
  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]);

  useEffect(() => {
    fetchIdentity();
  }, []);

  const handleExportPDF = async () => {
    setExportLoading(true);
    try {
      const [identityData, swotData, bscData, canvasData] = await Promise.all([
        getStrategicIdentity(),
        getSwotItems(),
        getBscPerspectives(),
        getBusinessModelCanvas()
      ]);
      
      await exportStrategicPlanningToPDF(identityData, swotData, bscData, canvasData);
    } catch (error) {
      console.error("Error exporting PDF:", error);
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <AuthenticationRequired>
      <div className="min-h-screen bg-background w-full">
        <div className="w-full max-w-full px-4 sm:px-6 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Planejamento Estratégico</h1>
              <p className="text-muted-foreground mt-1">
                Defina e acompanhe a estratégia da sua organização
              </p>
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleExportPDF} 
              disabled={exportLoading}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              {exportLoading ? "Gerando..." : "Exportar Relatório"}
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="identity">Identidade Estratégica</TabsTrigger>
              <TabsTrigger value="swot">Análise SWOT</TabsTrigger>
              <TabsTrigger value="bsc">Balanced Scorecard</TabsTrigger>
              <TabsTrigger value="canvas">Business Model Canvas</TabsTrigger>
              <TabsTrigger value="action_plan">Plano de Ação</TabsTrigger>
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
            
            <TabsContent value="action_plan">
              <StrategicActionPlan />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthenticationRequired>
  );
};

export default StrategicPlanning;
