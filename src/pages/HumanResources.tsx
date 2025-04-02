
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";
import { HRFilters } from "@/components/hr/HRFilters";
import { HRHeader } from "@/components/hr/HRHeader";
import { HRTabSelect } from "@/components/hr/HRTabSelect";
import { HRTabContent } from "@/components/hr/HRTabContent";
import { hrTabGroups } from "@/components/hr/HRTabConfig";
import { useLocation } from "react-router-dom";

const HumanResources = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const location = useLocation();

  // Set active tab from URL state if available
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      {/* Adjusted padding to provide more space for content */}
      <main className="md:pl-72 pt-16 p-6 transition-all duration-300 flex-1">
        <div className="max-w-7xl mx-auto w-full space-y-6">
          <HRHeader />
          
          {activeTab !== "ambiente" && <HRFilters />}

          {/* Simplified navigation system with flattened tabs */}
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
};

export default HumanResources;
