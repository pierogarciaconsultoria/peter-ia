
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OrgStructureChart } from "./OrgStructureChart";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function OrgStructureTabs() {
  const [activeView, setActiveView] = useState<"chart">("chart");
  const navigate = useNavigate();
  
  const handleViewJobPositions = () => {
    navigate("/human-resources", { state: { activeTab: "job-plan" } });
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeView} onValueChange={(v) => setActiveView(v as "chart")}>
        <TabsList className="mb-4">
          <TabsTrigger value="chart">Organograma</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chart">
          <OrgStructureChart />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-center mt-8">
        <Button 
          variant="outline" 
          className="flex items-center gap-2" 
          onClick={handleViewJobPositions}
        >
          <ExternalLink className="h-4 w-4" />
          Ver Lista Completa de Cargos
        </Button>
      </div>
    </div>
  );
}
