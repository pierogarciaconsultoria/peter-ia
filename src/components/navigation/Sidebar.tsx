
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/contexts/SidebarContext";
import { 
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
} from "@/components/ui/sidebar";

// Import sidebar components
import { SidebarToggle } from "./sidebar/SidebarToggle";
import { SidebarCategory } from "./sidebar/SidebarCategory";
import { useSidebarState } from "./sidebar/useSidebarState";

// Import all menu items
import menuItems from "./MenuItems";

// Define our menu categories with labels
const menuCategories = [
  { label: "Principal", items: menuItems.filter(item => item.modulo === "dashboard") },
  { label: "ISO 9001:2015", items: menuItems.filter(item => item.modulo === "iso") },
  { label: "Planejamento Estratégico", items: menuItems.filter(item => item.modulo === "planejamento_estrategico") },
  { label: "Processos", items: menuItems.filter(item => item.modulo === "processos") },
  { label: "Indicadores", items: menuItems.filter(item => item.modulo === "indicadores_desempenho") },
  { label: "Plano de Ação", items: menuItems.filter(item => item.modulo === "plano_acao") },
  { label: "Reuniões", items: menuItems.filter(item => item.modulo === "reunioes") },
  { label: "Qualidade", items: menuItems.filter(item => item.modulo === "qualidade") },
  { label: "Gente e Gestão", items: menuItems.filter(item => item.modulo === "rh") },
  { label: "Recursos", items: menuItems.filter(item => item.modulo === "ambiente") },
  { label: "Configurações", items: menuItems.filter(item => item.modulo === "admin" || item.modulo === "tarefas") }
];

export function Sidebar() {
  const { collapsed } = useSidebar();
  const {
    pathname,
    expandedItems,
    hoveredItem,
    handleMouseEnter,
    handleMouseLeave,
    toggleItemExpanded
  } = useSidebarState();

  // Filter categories to only show those with at least one item
  const nonEmptyCategories = menuCategories.filter(category => category.items.length > 0);

  return (
    <ShadcnSidebar 
      collapsible={collapsed ? "icon" : "none"}
      variant="sidebar"
      className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <SidebarHeader className="px-2 py-2 border-b">
        <div className="flex items-center justify-center h-14">
          {!collapsed && (
            <h2 className="text-lg font-semibold">SGQ Sistema</h2>
          )}
          {collapsed && (
            <span className="text-xl font-bold">SGQ</span>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-0 py-0 overflow-y-auto">
        <SidebarMenu>
          {nonEmptyCategories.map((category) => (
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
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="mt-auto border-t py-2">
        <SidebarToggle collapsed={collapsed} />
      </SidebarFooter>
    </ShadcnSidebar>
  );
}
