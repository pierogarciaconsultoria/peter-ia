
import React, { createContext, useContext, useState, useEffect } from "react";

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  
  useEffect(() => {
    // Inicializa o estado do sidebar baseado em preferências ou estado salvo
    const savedState = localStorage.getItem("sidebar-collapsed");
    if (savedState) {
      setCollapsed(savedState === "true");
    }
  }, []);
  
  // Persiste a mudança de estado no localStorage
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);
  
  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar deve ser usado dentro de um SidebarProvider");
  }
  return context;
};
