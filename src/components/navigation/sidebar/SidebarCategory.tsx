
import { ReactNode } from "react";
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
  return (
    <div key={`category-${label}`} className="space-y-1">
      {!collapsed && items.length > 0 && label !== "Principal" && (
        <div className="h-3"></div>
      )}
      
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
  );
}
