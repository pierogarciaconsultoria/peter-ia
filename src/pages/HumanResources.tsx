import { useState, useEffect } from "react";
import { HRFilters } from "@/components/hr/HRFilters";
import { HRHeader } from "@/components/hr/HRHeader";
import { HRTabSelect } from "@/components/hr/HRTabSelect";
import { HRTabContent } from "@/components/hr/HRTabContent";
import { hrTabGroups } from "@/components/hr/HRTabConfig";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useSidebar } from "@/contexts/SidebarContext";
import { StarkCorpDemo } from "@/components/hr/StarkCorpDemo";
import { Loader2 } from "lucide-react";
import { AuthenticationRequired } from "@/components/auth/AuthenticationRequired";

const HumanResources = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { collapsed } = useSidebar();

  // Set active tab from URL query parameters or location state
  useEffect(() => {
    // Reset loading state for infinite loading issues
    setIsLoading(false);
    
    // Check for URL query parameters first
    const tabFromQuery = searchParams.get('activeTab');
    
    if (tabFromQuery) {
      setActiveTab(tabFromQuery);
      console.log(`Setting active tab from query param: ${tabFromQuery}`);
    } 
    // If no query param, try location state
    else if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      console.log(`Setting active tab from location state: ${location.state.activeTab}`);
    }
    // Keep default that was set in useState
  }, [searchParams, location.state]);

  // Handle tab change and update URL
  const handleTabChange = (tabId: string) => {
    if (tabId === activeTab) return; // Prevent unnecessary state updates
    
    setActiveTab(tabId);
    console.log(`Tab changed to: ${tabId}`);
    
    // Update URL query parameter for better bookmarking and navigation
    navigate(`/human-resources?activeTab=${tabId}`, { replace: true });
  };

  return (
    <AuthenticationRequired>
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
          
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-muted-foreground">Carregando...</p>
            </div>
          ) : (
            <HRTabContent 
              activeTab={activeTab} 
              onTabChange={handleTabChange} 
            />
          )}
          
          {/* Add the Stark Corp demo button */}
          <StarkCorpDemo />
        </div>
      </div>
    </AuthenticationRequired>
  );
};

export default HumanResources;
