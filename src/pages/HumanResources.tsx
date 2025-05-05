
import { useState, useEffect } from "react";
import { HRFilters } from "@/components/hr/HRFilters";
import { HRHeader } from "@/components/hr/HRHeader";
import { HRTabSelect } from "@/components/hr/HRTabSelect";
import { HRTabContent } from "@/components/hr/HRTabContent";
import { hrTabGroups } from "@/components/hr/HRTabConfig";
import { useLocation, useNavigate } from "react-router-dom";
import { useSidebar } from "@/contexts/SidebarContext";

const HumanResources = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const location = useLocation();
  const navigate = useNavigate();
  const { collapsed } = useSidebar();

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
    <div className="min-h-screen bg-background">
      <div className="w-full px-4 sm:px-6 py-6 space-y-6">
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
    </div>
  );
};

export default HumanResources;
