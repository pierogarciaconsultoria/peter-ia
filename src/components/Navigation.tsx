
import { useLocation, Outlet } from "react-router-dom";
import { MenuToggle } from "./navigation/MenuToggle";
import { UserMenu } from "./navigation/UserMenu";
import { Sidebar } from "./navigation/Sidebar";
import { BackToHomeButton } from "./navigation/BackToHomeButton";
import { NotificationCenter } from "./notifications/NotificationCenter";
import { AssistantButton } from "./navigation/AssistantButton";
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
      
      {/* Main content area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-64'} min-w-0`}>
        <header className="flex-shrink-0 h-16 bg-background/95 backdrop-blur-sm border-b">
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
              <AssistantButton />
              <NotificationCenter />
              <UserMenu />
            </div>
          </div>
        </header>
        
        {/* Main content without extra padding - each page controls its own spacing */}
        <main className="flex-1 overflow-auto">
          <div className="w-full max-w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
