
import { useState } from "react";
import { QualityControlDashboard } from "@/components/quality-control/QualityControlDashboard";
import { QualityCriteriaManager } from "@/components/quality-control/QualityCriteriaManager";
import { QualityInspectionForm } from "@/components/quality-control/QualityInspectionForm";
import { QualityReports } from "@/components/quality-control/QualityReports";
import { useSidebar } from "@/contexts/SidebarContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const QualityControl = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-4 sm:px-6 py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Controle de Qualidade</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie critérios e inspeções de qualidade
          </p>
        </div>
        
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="inspections">Nova Inspeção</TabsTrigger>
            <TabsTrigger value="criteria">Critérios de Qualidade</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <QualityControlDashboard />
          </TabsContent>
          
          <TabsContent value="inspections">
            <QualityInspectionForm />
          </TabsContent>
          
          <TabsContent value="criteria">
            <QualityCriteriaManager />
          </TabsContent>
          
          <TabsContent value="reports">
            <QualityReports />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default QualityControl;
