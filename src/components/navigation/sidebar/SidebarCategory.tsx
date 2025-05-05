
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from "@/components/ui/sidebar";
import { MenuItem } from "../types";
import { SidebarMenuItem } from "./SidebarMenuItem";

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
}: SidebarCategoryProps) {
  // Don't render empty categories
  if (items.length === 0) return null;
  
  return (
    <SidebarGroup key={`category-${label}`}>
      {!collapsed && label !== "Principal" && (
        <SidebarGroupLabel>{label}</SidebarGroupLabel>
      )}
      
      <SidebarGroupContent>
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
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
