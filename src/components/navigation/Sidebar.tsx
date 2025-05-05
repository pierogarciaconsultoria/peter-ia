
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/contexts/SidebarContext";

// Import sidebar components
import { SidebarToggle } from "./sidebar/SidebarToggle";
import { SidebarCategory } from "./sidebar/SidebarCategory";
import { useSidebarState } from "./sidebar/useSidebarState";

// Import all menu categories
import { dashboardItems } from "./menu-categories/dashboard-items";
import { isoItems } from "./menu-categories/iso-items";
import { strategicItems } from "./menu-categories/strategic-items";
import { processItems } from "./menu-categories/process-items";
import { indicatorsItems } from "./menu-categories/indicators-items";
import { actionItems } from "./menu-categories/action-items";
import { meetingItems } from "./menu-categories/meeting-items";
import { qualityItems } from "./menu-categories/quality-items";
import { hrItems } from "./menu-categories/hr";
import { resourcesItems } from "./menu-categories/resources-items";
import { settingsItems } from "./menu-categories/settings-items";

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
  const { collapsed, setCollapsed } = useSidebar();
  const {
    pathname,
    expandedItems,
    hoveredItem,
    handleMouseEnter,
    handleMouseLeave,
    toggleItemExpanded
  } = useSidebarState();

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
          <SidebarToggle collapsed={collapsed} toggleSidebar={toggleSidebar} />
        </div>

        <ScrollArea className="flex-1">
          <nav className="space-y-2 px-3 py-2">
            {menuCategories.map((category) => (
              <SidebarCategory
                key={`category-${category.label}`}
                label={category.label}
                items={category.items}
                collapsed={collapsed}
                pathname={pathname}
                expandedItems={expandedItems}
                hoveredItem={hoveredItem}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                toggleItemExpanded={toggleItemExpanded}
              />
            ))}
          </nav>
        </ScrollArea>
      </div>
    </div>
  );
}
