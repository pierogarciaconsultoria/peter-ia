
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/contexts/SidebarContext";

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
  { label: "Qualidade", items: menuItems.filter(item => 
    item.modulo === "qualidade" || 
    item.modulo === "nao_conformidades" || 
    item.modulo === "auditoria"
  ) },
  { label: "Gente e Gestão", items: menuItems.filter(item => item.modulo === "rh") },
  { label: "Ambiente", items: menuItems.filter(item => item.modulo === "ambiente") },
  { label: "Tarefas", items: menuItems.filter(item => item.modulo === "tarefas") },
  { label: "Administração", items: menuItems.filter(item => item.modulo === "admin") }
];

// Create a utility function to deduplicate items by href
const deduplicateItems = (categories) => {
  // Track used hrefs to avoid duplicates
  const usedHrefs = new Set();
  
  return categories.map(category => {
    // Filter out any items whose hrefs have already been used
    const uniqueItems = category.items.filter(item => {
      if (item.href === "#") return true; // Always keep parent items with "#" href
      if (usedHrefs.has(item.href)) {
        return false;
      }
      usedHrefs.add(item.href);
      return true;
    });
    
    return {
      ...category,
      items: uniqueItems
    };
  });
};

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

  // Filter categories to only show those with at least one item and deduplicate
  const nonEmptyCategories = deduplicateItems(menuCategories).filter(category => category.items.length > 0);

  return (
    <div 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="px-3 py-2 border-b border-sidebar-border">
          <div className="flex items-center justify-center h-14">
            {!collapsed && (
              <h2 className="text-lg font-semibold text-white">SGQ Sistema</h2>
            )}
            {collapsed && (
              <span className="text-xl font-bold text-white">SGQ</span>
            )}
          </div>
        </div>
        
        {/* Content - Menu Items */}
        <div className="flex-1 py-0 overflow-y-auto scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-sidebar">
          <nav className="flex flex-col gap-1 p-2">
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
                hideLabelForSingleItem={true}
              />
            ))}
          </nav>
        </div>
        
        {/* Footer */}
        <div className="mt-auto border-t border-sidebar-border py-2">
          <SidebarToggle collapsed={collapsed} />
        </div>
      </div>
    </div>
  );
}
