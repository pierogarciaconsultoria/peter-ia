
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  // Set active tab from URL state if available
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  // Detect if sidebar is collapsed
  useEffect(() => {
    const checkSidebarState = () => {
      const sidebar = document.querySelector('[class*="md:w-20"]');
      setSidebarCollapsed(!!sidebar);
    };
    
    // Check sidebar state periodically
    const interval = setInterval(checkSidebarState, 500);
    
    return () => clearInterval(interval);
  }, []);

  // Handle tab change and ensure dropdowns show the correct content
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    
    // Additional logic could be added here if needed for dropdown state management
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      {/* Adjusted padding to provide space for breadcrumb navigation */}
      <main className={`transition-all duration-300 pt-24 p-6 flex-1 ${sidebarCollapsed ? 'md:pl-24' : 'md:pl-72'}`}>
        <div className="max-w-7xl mx-auto w-full space-y-6">
          <HRHeader />
          
          {activeTab !== "ambiente" && <HRFilters />}

          {/* Dropdown navigation system */}
          <HRTabSelect 
            tabGroups={hrTabGroups} 
            activeTab={activeTab} 
            setActiveTab={handleTabChange} 
          />
          
          <HRTabContent 
            activeTab={activeTab} 
            onTabChange={handleTabChange} 
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HumanResources;
