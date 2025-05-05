
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
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { visible } = useScrollDirection();
  const { collapsed } = useSidebar();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <SidebarProvider defaultOpen={!collapsed}>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <SidebarInset>
          <div className="fixed top-0 left-0 right-0 z-30 h-16 bg-background/80 backdrop-blur-sm">
            <div className="container flex h-full items-center justify-between">
              <div className="flex items-center gap-2">
                <MenuToggle 
                  isOpen={isOpen} 
                  onToggle={() => setIsOpen(!isOpen)}
                  className={`transition-opacity duration-300 ${!visible ? 'opacity-0' : 'opacity-100'}`}
                />
                <BackToHomeButton />
              </div>
              <div className="flex items-center gap-2">
                <NotificationCenter />
                <UserMenu />
              </div>
            </div>
          </div>
          
          {/* Breadcrumb navigation - positioned below the header */}
          <div className="fixed top-16 left-0 right-0 z-20 px-6 py-2 bg-background/80 backdrop-blur-sm">
            <BreadcrumbNavigation />
          </div>
          
          {/* Main content padding to account for fixed header and breadcrumb */}
          <div className="pt-28 px-4 md:px-6">
            {/* App content will be rendered here */}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
