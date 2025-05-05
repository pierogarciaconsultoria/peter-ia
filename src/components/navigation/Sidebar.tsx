
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { menuItems } from "@/components/navigation/MenuItems";
import { useSidebar } from "@/contexts/SidebarContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Import all menu categories
import { dashboardItems } from "./menu-categories/dashboard-items";
import { isoItems } from "./menu-categories/iso-items";
import { strategicItems } from "./menu-categories/strategic-items";
import { processItems } from "./menu-categories/process-items";
import { indicatorsItems } from "./menu-categories/indicators-items";
import { actionItems } from "./menu-categories/action-items";
import { meetingItems } from "./menu-categories/meeting-items";
import { qualityItems } from "./menu-categories/quality-items";
import { hrItems } from "./menu-categories/hr"; // Updated import path
import { resourcesItems } from "./menu-categories/resources-items";
import { settingsItems } from "./menu-categories/settings-items";
import { MenuItem } from "./types";

// Define our menu categories with labels
const menuCategories = [
  { label: "Principal", items: dashboardItems },
  { label: "ISO 9001:2015", items: isoItems },
  { label: "Planejamento Estratégico", items: strategicItems },
  { label: "Processos", items: processItems },
  { label: "Indicadores", items: indicatorsItems },
  { label: "Plano de Ação", items: actionItems },
  { label: "Reuniões", items: meetingItems },
  { label: "Qualidade", items: qualityItems },
  { label: "Gente e Gestão", items: hrItems },
  { label: "Recursos", items: resourcesItems },
  { label: "Configurações", items: settingsItems }
];

export function Sidebar() {
  const { pathname } = useLocation();
  const { collapsed, setCollapsed } = useSidebar();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Initialize expanded state based on the current path
  useEffect(() => {
    // Reset expanded states
    const newExpandedState: Record<string, boolean> = {};
    
    // Check which menu items match the current path
    menuCategories.forEach(category => {
      category.items.forEach(item => {
        // If this item or any of its children match the current path, expand it
        const isActive = pathname === item.href || 
          (item.children?.some(child => pathname === child.href));
        
        if (isActive && item.children?.length) {
          newExpandedState[item.href || item.title] = true;
        }
      });
    });
    
    setExpandedItems(newExpandedState);
  }, [pathname]);

  // Handle mouse enter for an item
  const handleMouseEnter = (itemKey: string) => {
    setHoveredItem(itemKey);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  // Toggle an item's expanded state when clicked
  const toggleItemExpanded = (itemKey: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemKey]: !prev[itemKey]
    }));
  };

  // Render a single menu item
  const renderMenuItem = (item: MenuItem) => {
    const itemKey = item.href || item.title;
    const isExpanded = expandedItems[itemKey] || hoveredItem === itemKey;
    const isActive = pathname === item.href || item.children?.some(child => pathname === child.href);
    
    if (item.children && item.children.length > 0) {
      return (
        <div 
          key={itemKey}
          className="w-full" 
          onMouseEnter={() => handleMouseEnter(itemKey)}
          onMouseLeave={handleMouseLeave}
        >
          <Collapsible open={isExpanded} className="w-full">
            <div className="flex w-full">
              <CollapsibleTrigger 
                onClick={(e) => {
                  e.preventDefault();
                  toggleItemExpanded(itemKey);
                }}
                className="w-full"
              >
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted",
                    collapsed && "justify-center px-2",
                    isActive ? "bg-muted" : "transparent"
                  )}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {!collapsed && <span>{item.title}</span>}
                </div>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className={collapsed ? "hidden" : ""}>
              <div className="ml-6 flex flex-col space-y-1">
                {item.children.map((child) => (
                  <NavLink
                    key={child.href}
                    to={child.href}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "transparent hover:bg-muted hover:text-foreground"
                      )
                    }
                  >
                    {child.icon && <child.icon className="h-4 w-4" />}
                    <span>{child.title}</span>
                  </NavLink>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      );
    }

    return (
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
    );
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
          <nav className="space-y-2 px-3 py-2">
            {menuCategories.map((category, index) => (
              <div key={`category-${index}`} className="space-y-1">
                {!collapsed && index > 0 && (
                  <div className="h-3"></div>
                )}
                
                {category.items.map((item) => renderMenuItem(item))}
              </div>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </div>
  );
}
