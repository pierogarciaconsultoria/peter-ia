
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { HRFilters } from "@/components/hr/HRFilters";
import { HRHeader } from "@/components/hr/HRHeader";
import { HRTabGroup } from "@/components/hr/HRTabGroup";
import { HRTabSelect } from "@/components/hr/HRTabSelect";
import { HRTabContent } from "@/components/hr/HRTabContent";
import { hrTabGroups } from "@/components/hr/HRTabConfig";

const HumanResources = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="md:pl-64 p-6 transition-all duration-300 flex-1">
        <div className="max-w-6xl mx-auto space-y-6">
          <HRHeader />
          
          <HRFilters />

          <HRTabSelect 
            tabGroups={hrTabGroups} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
          
          <HRTabGroup 
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
};

export default HumanResources;
