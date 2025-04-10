
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ReunioesHeader } from "@/components/reunioes/ReunioesHeader";
import { ReunioesTabSelect } from "@/components/reunioes/ReunioesTabSelect";
import { ReunioesTabContent } from "@/components/reunioes/ReunioesTabContent";
import { PermissionGuard } from "@/components/auth/PermissionGuard";

const Reunioes = () => {
  const [activeTab, setActiveTab] = useState("agendadas");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Detectar se a barra lateral está recolhida
  useState(() => {
    const checkSidebarState = () => {
      const sidebar = document.querySelector('[class*="md:w-20"]');
      setSidebarCollapsed(!!sidebar);
    };
    
    checkSidebarState();
    const interval = setInterval(checkSidebarState, 500);
    
    return () => clearInterval(interval);
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className={`transition-all duration-300 pt-16 p-6 flex-1 ${sidebarCollapsed ? 'md:pl-24' : 'md:pl-72'}`}>
        <PermissionGuard modulo="reunioes">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            <ReunioesHeader />
            
            <ReunioesTabSelect activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <ReunioesTabContent activeTab={activeTab} />
          </div>
        </PermissionGuard>
      </main>
      
      <Footer />
    </div>
  );
};

export default Reunioes;
