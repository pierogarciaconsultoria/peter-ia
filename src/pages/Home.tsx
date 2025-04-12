
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Dashboard } from "@/components/Dashboard";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { isoRequirements } from "@/utils/isoRequirements";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 p-8 pt-24 md:pt-16 md:pl-64">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Dashboard title removed */}
          
          <Tabs defaultValue="dashboard">
            {/* Dashboard button removed */}
            
            <TabsContent value="dashboard">
              <Dashboard requirements={isoRequirements} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
