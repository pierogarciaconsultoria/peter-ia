
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { menuItems } from "@/components/navigation/MenuItems";
import { useSidebar } from "@/contexts/SidebarContext";

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
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Initialize expanded state based on the current path
  useEffect(() => {
    const matchingCategory = menuCategories.findIndex(category => 
      category.items.some(item => 
        pathname === item.href || 
        (item.children?.some(child => pathname === child.href))
      )
    );
    
    if (matchingCategory !== -1) {
      setExpandedCategories([`category-${matchingCategory}`]);
    }
  }, [pathname]);

  // Render a single menu item
  const renderMenuItem = (item: MenuItem) => {
    if (item.children && item.children.length > 0) {
      return (
        <Accordion
          type="single"
          collapsible
          className="w-full"
          value={collapsed ? undefined : `item-${item.href}`}
        >
          <AccordionItem value={`item-${item.href}`} className="border-none">
            <div className="flex">
              <AccordionTrigger 
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted",
                  collapsed && "justify-center px-2",
                  "hover:no-underline w-full"
                )}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {!collapsed && <span>{item.title}</span>}
              </AccordionTrigger>
            </div>
            <AccordionContent className={collapsed ? "hidden" : ""}>
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
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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
                {/* Removed the separator with category label, just adding minimal top spacing for categories after the first */}
                {!collapsed && index > 0 && (
                  <div className="h-3"></div>
                )}
                
                {/* Category Items */}
                {category.items.map((item) => (
                  <div key={item.href || `nested-${item.title}`}>
                    {renderMenuItem(item)}
                  </div>
                ))}
              </div>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </div>
  );
}

