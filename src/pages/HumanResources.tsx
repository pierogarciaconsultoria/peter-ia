
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";
import { HRFilters } from "@/components/hr/HRFilters";
import { HRHeader } from "@/components/hr/HRHeader";
import { HRTabGroup } from "@/components/hr/HRTabGroup";
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
      
      {/* Adjusted padding to align with header elements */}
      <main className="md:pl-64 pt-16 p-6 transition-all duration-300 flex-1">
        <div className="max-w-6xl mx-auto space-y-6">
          <HRHeader />
          
          {activeTab !== "ambiente" && <HRFilters />}

          {/* New simplified navigation system */}
          <HRTabSelect 
            tabGroups={hrTabGroups} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
          
          {/* Show tab group navigation only when a group is selected */}
          {activeTab !== "dashboard" && activeTab !== "ambiente" && (
            <HRTabGroup 
              tabGroups={hrTabGroups} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />
          )}
          
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
