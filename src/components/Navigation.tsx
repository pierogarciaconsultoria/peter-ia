
import { useLocation } from "react-router-dom";
import { MenuToggle } from "./navigation/MenuToggle";
import { UserMenu } from "./navigation/UserMenu";
import { Sidebar } from "./navigation/Sidebar";
import { BackToHomeButton } from "./navigation/BackToHomeButton";
import { NotificationCenter } from "./notifications/NotificationCenter";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useSidebar } from "@/contexts/SidebarContext";

export function Navigation() {
  const location = useLocation();
  const { visible } = useScrollDirection();
  const { collapsed, toggleSidebar } = useSidebar();

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-64'}`}>
        <header className="fixed top-0 right-0 z-30 w-full h-16 bg-background/95 backdrop-blur-sm border-b">
          <div className="flex h-full items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <MenuToggle 
                isOpen={!collapsed} 
                onToggle={toggleSidebar}
                className="ml-2"
              />
              <BackToHomeButton />
            </div>
            <div className="flex items-center gap-2">
              <NotificationCenter />
              <UserMenu />
            </div>
          </div>
        </header>
        
        {/* Main content padding to account for fixed header */}
        <main className="pt-16 pb-6 h-screen overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
