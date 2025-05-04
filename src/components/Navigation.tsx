
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MenuToggle } from "./navigation/MenuToggle";
import { UserMenu } from "./navigation/UserMenu";
import { Sidebar } from "./navigation/Sidebar";
import { BackToHomeButton } from "./navigation/BackToHomeButton";
import { NotificationCenter } from "./notifications/NotificationCenter";
import { BreadcrumbNavigation } from "./navigation/BreadcrumbNavigation";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useSidebar } from "@/contexts/SidebarContext";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { visible } = useScrollDirection();
  const { collapsed, setCollapsed } = useSidebar();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      <MenuToggle 
        isOpen={isOpen} 
        onToggle={() => setIsOpen(!isOpen)} 
        className={`transition-opacity duration-300 ${!visible ? 'opacity-0' : 'opacity-100'}`}
      />
      <BackToHomeButton />
      <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 transition-all duration-300 ${collapsed ? 'md:ml-20' : 'md:ml-72'}`}>
        <NotificationCenter />
        <UserMenu />
      </div>
      <Sidebar />
      
      {/* Breadcrumb navigation - positioned below the header */}
      <div className={`fixed top-16 left-0 right-0 z-40 px-6 py-2 bg-background/80 backdrop-blur-sm transition-all duration-300 ${collapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <BreadcrumbNavigation />
      </div>
    </>
  );
}
