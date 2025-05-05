
import { MenuItem } from "../types";
import { SidebarMenuItem } from "./menu-item";
import { cn } from "@/lib/utils";

interface SidebarCategoryProps {
  label: string;
  items: MenuItem[];
  collapsed: boolean;
  pathname: string;
  expandedItems: Record<string, boolean>;
  hoveredItem: string | null;
  onMouseEnter: (itemKey: string) => void;
  onMouseLeave: () => void;
  toggleItemExpanded: (itemKey: string) => void;
  hideLabelForSingleItem?: boolean;
}

export function SidebarCategory({
  label,
  items,
  collapsed,
  pathname,
  expandedItems,
  hoveredItem,
  onMouseEnter,
  onMouseLeave,
  toggleItemExpanded,
  hideLabelForSingleItem = false,
}: SidebarCategoryProps) {
  // Don't render empty categories
  if (items.length === 0) return null;
  
  // Determine if we should hide the label
  const shouldHideLabel = hideLabelForSingleItem && items.length === 1;
  
  // Also hide labels for "Recursos" and "Configurações" categories
  const hideSpecificLabels = label === "Recursos" || label === "Configurações";
  
  return (
    <div className="px-2 py-1">
      {!collapsed && !shouldHideLabel && !hideSpecificLabels && label !== "Principal" && (
        <div className="mb-1 px-2 text-xs font-medium leading-6 text-foreground/60">
          {label}
        </div>
      )}
      
      <div className="space-y-1">
        {items.map((item) => (
          <SidebarMenuItem
            key={item.href || item.title}
            item={item}
            pathname={pathname}
            collapsed={collapsed}
            expandedItems={expandedItems}
            hoveredItem={hoveredItem}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            toggleItemExpanded={toggleItemExpanded}
          />
        ))}
      </div>
    </div>
  );
}
