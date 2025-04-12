
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { QualityControlDashboard } from "@/components/quality-control/QualityControlDashboard";
import { QualityCriteriaManager } from "@/components/quality-control/QualityCriteriaManager";
import { QualityInspectionForm } from "@/components/quality-control/QualityInspectionForm";
import { QualityReports } from "@/components/quality-control/QualityReports";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const QualityControl = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Detect if sidebar is collapsed
  useState(() => {
    const checkSidebarState = () => {
      const sidebar = document.querySelector('[class*="md:w-20"]');
      setSidebarCollapsed(!!sidebar);
    };
    
    // Check sidebar state periodically
    const interval = setInterval(checkSidebarState, 500);
    
    return () => clearInterval(interval);
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className={`transition-all duration-300 pt-16 p-6 flex-1 ${sidebarCollapsed ? 'md:pl-24' : 'md:pl-72'}`}>
        <div className="max-w-6xl mx-auto space-y-6">
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
      </main>
      
      <Footer />
    </div>
  );
};

export default QualityControl;
