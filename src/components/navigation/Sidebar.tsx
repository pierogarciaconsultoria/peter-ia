
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { menuItems } from "@/components/navigation/MenuItems";
import { useSidebar } from "@/contexts/SidebarContext";

export function Sidebar() {
  const { pathname } = useLocation();
  const { collapsed, setCollapsed } = useSidebar();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={cn(
        "fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-card border-r pt-16",
        collapsed ? "md:w-20" : "md:w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="px-3 py-2">
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto w-full flex justify-between mb-2"
            onClick={toggleSidebar}
          >
            {collapsed ? (
              <>
                <span className="sr-only">Expandir</span>
                <ChevronsRight className="h-4 w-4" />
              </>
            ) : (
              <>
                <span>Recolher</span>
                <ChevronsLeft className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <nav className="space-y-1 px-3 py-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "transparent hover:bg-muted hover:text-foreground",
                    collapsed && "justify-center px-2"
                  )
                }
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </div>
  );
}
