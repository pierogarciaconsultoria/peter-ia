
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Dashboard } from "@/components/Dashboard";
import { DatabaseConnectionTest } from "@/components/DatabaseConnectionTest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isoRequirements } from "@/utils/isoRequirements";
import { useSidebar } from "@/contexts/SidebarContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImplementationSchedule } from "@/components/dashboard/ImplementationSchedule";
import { MaturityMetrics } from "@/components/dashboard/MaturityMetrics";

export default function Home() {
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className={`flex-1 p-8 pt-24 md:pt-16 transition-all duration-300 ${collapsed ? 'md:pl-24' : 'md:pl-64'}`}>
        <div className="max-w-7xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Sistema de Gestão da Qualidade</h2>
              <p className="text-muted-foreground">
                Monitoramento e controle dos requisitos da norma ISO 9001:2015, com foco na implementação
                e melhoria contínua do Sistema de Gestão da Qualidade.
              </p>
            </CardContent>
          </Card>
          
          <ImplementationSchedule />
          
          <MaturityMetrics requirements={isoRequirements} />
          
          <Tabs defaultValue="dashboard" className="mt-8">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="connection">Status da Conexão</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <Dashboard requirements={isoRequirements} />
            </TabsContent>
            
            <TabsContent value="connection">
              <div className="max-w-3xl mx-auto py-4">
                <DatabaseConnectionTest />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
