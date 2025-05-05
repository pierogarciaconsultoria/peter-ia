
import { useState, useEffect } from "react";
import { HRFilters } from "@/components/hr/HRFilters";
import { HRHeader } from "@/components/hr/HRHeader";
import { HRTabSelect } from "@/components/hr/HRTabSelect";
import { HRTabContent } from "@/components/hr/HRTabContent";
import { hrTabGroups } from "@/components/hr/HRTabConfig";
import { useLocation, useNavigate } from "react-router-dom";
import { useSidebar as useCustomSidebar } from "@/contexts/SidebarContext";

const HumanResources = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const location = useLocation();
  const navigate = useNavigate();
  const { collapsed } = useCustomSidebar();

  // Set active tab from URL state or query params if available
  useEffect(() => {
    // Check for URL query parameters first
    const params = new URLSearchParams(location.search);
    const tabFromQuery = params.get('activeTab');
    
    if (tabFromQuery) {
      setActiveTab(tabFromQuery);
    } 
    // If no query param, try location state
    else if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.search, location.state]);

  // Handle tab change and update URL
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    
    // Update URL query parameter for better bookmarking and navigation
    navigate(`/human-resources?activeTab=${tabId}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Adjusted padding to provide space for breadcrumb navigation */}
      <main className={`transition-all duration-300 pt-24 p-6 flex-1 ${collapsed ? 'md:pl-24' : 'md:pl-72'}`}>
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
    </div>
  );
};

export default HumanResources;
