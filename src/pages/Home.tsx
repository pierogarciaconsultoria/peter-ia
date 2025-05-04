
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Dashboard } from "@/components/Dashboard";
import { DatabaseConnectionTest } from "@/components/DatabaseConnectionTest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isoRequirements } from "@/utils/isoRequirements";
import { useSidebar } from "@/contexts/SidebarContext";

export default function Home() {
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className={`flex-1 p-8 pt-24 md:pt-16 transition-all duration-300 ${collapsed ? 'md:pl-24' : 'md:pl-64'}`}>
        <div className="max-w-7xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          
          <Tabs defaultValue="dashboard">
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
