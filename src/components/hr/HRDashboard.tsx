
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OverviewTab } from "./dashboard/OverviewTab";
import { PeopleTab } from "./dashboard/PeopleTab";
import { TrainingTab } from "./dashboard/TrainingTab";
import { FinancialTab } from "./dashboard/FinancialTab";
import { HRDashboardProvider } from "./dashboard/HRDashboardProvider";

export function HRDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <HRDashboardProvider>
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full mb-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="people">Pessoas</TabsTrigger>
            <TabsTrigger value="training">Capacitação</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>
          
          <TabsContent value="people">
            <PeopleTab />
          </TabsContent>
          
          <TabsContent value="training">
            <TrainingTab />
          </TabsContent>
          
          <TabsContent value="financial">
            <FinancialTab />
          </TabsContent>
        </Tabs>
      </div>
    </HRDashboardProvider>
  );
}
