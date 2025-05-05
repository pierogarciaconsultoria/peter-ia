
import { useState, useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import { MenuToggle } from "./navigation/MenuToggle";
import { UserMenu } from "./navigation/UserMenu";
import { Sidebar } from "./navigation/Sidebar";
import { BackToHomeButton } from "./navigation/BackToHomeButton";
import { NotificationCenter } from "./notifications/NotificationCenter";
import { BreadcrumbNavigation } from "./navigation/BreadcrumbNavigation";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useSidebar } from "@/contexts/SidebarContext";
import { SidebarProvider } from "@/components/ui/sidebar";

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
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-0 md:ml-16' : 'ml-0 md:ml-64'}`}>
        <header className="fixed top-0 right-0 left-0 z-30 h-16 bg-background/80 backdrop-blur-sm">
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
        </header>
        
        {/* Breadcrumb navigation - positioned below the header */}
        <div className="fixed top-16 left-0 right-0 z-20 px-6 py-2 bg-background/80 backdrop-blur-sm">
          <BreadcrumbNavigation />
        </div>
        
        {/* Main content padding to account for fixed header and breadcrumb */}
        <main className="pt-28 px-4 md:px-6 pb-10 overflow-auto h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
