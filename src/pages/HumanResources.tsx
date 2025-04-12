
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { HRTabSelect } from "@/components/hr/HRTabSelect";
import { HRTabContent } from "@/components/hr/HRTabContent";
import { hrTabGroups } from "@/components/hr/HRTabConfig";
import { useLocation } from "react-router-dom";

export default function HumanResources() {
  const location = useLocation();
  const initialTab = location.state?.activeTab || "dashboard";
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 p-8 pt-24 md:pt-16 md:pl-64">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Gente e Gestão</h1>
          
          <HRTabSelect 
            tabGroups={hrTabGroups} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
          
          <HRTabContent 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
