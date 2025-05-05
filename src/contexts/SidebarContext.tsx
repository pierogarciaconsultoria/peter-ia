
import React, { createContext, useContext, useState, useEffect } from "react";

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to not collapsed (expanded sidebar)
  const [collapsed, setCollapsed] = useState(false);
  
  useEffect(() => {
    // Initialize sidebar state based on preferences or saved state
    const savedState = localStorage.getItem("sidebar-collapsed");
    if (savedState) {
      setCollapsed(savedState === "true");
    }
  }, []);
  
  // Persist state change in localStorage
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);
  
  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  };
  
  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
