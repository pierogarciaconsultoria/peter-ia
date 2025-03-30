
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HRDashboard } from "@/components/hr/HRDashboard";
import { EmployeeDirectory } from "@/components/hr/EmployeeDirectory";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, Plus, Upload } from "lucide-react";
import { HRFilters } from "@/components/hr/HRFilters";

const HumanResources = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="md:pl-64 p-6 transition-all duration-300 flex-1">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Gestão de Pessoas</h1>
              <p className="text-muted-foreground mt-1">
                Gerencie sua equipe de forma eficiente
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Importar
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button variant="outline" size="sm">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Relatórios
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Funcionário
              </Button>
            </div>
          </div>
          
          <HRFilters />
          
          <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="employees">Funcionários</TabsTrigger>
              <TabsTrigger value="departments">Departamentos</TabsTrigger>
              <TabsTrigger value="positions">Cargos</TabsTrigger>
              <TabsTrigger value="evaluations">Avaliações</TabsTrigger>
              <TabsTrigger value="trainings">Treinamentos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <HRDashboard />
            </TabsContent>
            
            <TabsContent value="employees">
              <EmployeeDirectory />
            </TabsContent>
            
            <TabsContent value="departments">
              <div className="text-center py-12">
                <p className="text-muted-foreground">Módulo de Departamentos será implementado em breve.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="positions">
              <div className="text-center py-12">
                <p className="text-muted-foreground">Módulo de Cargos será implementado em breve.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="evaluations">
              <div className="text-center py-12">
                <p className="text-muted-foreground">Módulo de Avaliações será implementado em breve.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="trainings">
              <div className="text-center py-12">
                <p className="text-muted-foreground">Módulo de Treinamentos será implementado em breve.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HumanResources;
