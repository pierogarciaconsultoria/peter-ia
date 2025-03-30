
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OrgStructureChart } from "./OrgStructureChart";
import { OrgStructureList } from "./OrgStructureList";

export function OrgStructureTabs() {
  const [activeView, setActiveView] = useState<"chart" | "list">("chart");
  
  return (
    <Tabs value={activeView} onValueChange={(v) => setActiveView(v as "chart" | "list")}>
      <TabsList className="mb-4">
        <TabsTrigger value="chart">Organograma</TabsTrigger>
        <TabsTrigger value="list">Lista de Cargos</TabsTrigger>
      </TabsList>
      
      <TabsContent value="chart">
        <OrgStructureChart />
      </TabsContent>
      
      <TabsContent value="list">
        <OrgStructureList />
      </TabsContent>
    </Tabs>
  );
}
