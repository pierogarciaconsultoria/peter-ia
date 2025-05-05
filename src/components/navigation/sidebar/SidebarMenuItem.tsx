
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MenuItem } from "../types";
import {
  SidebarMenuItem as ShadcnSidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SidebarMenuItemProps {
  item: MenuItem;
  pathname: string;
  collapsed: boolean;
  expandedItems: Record<string, boolean>;
  hoveredItem: string | null;
  onMouseEnter: (itemKey: string) => void;
  onMouseLeave: () => void;
  toggleItemExpanded: (itemKey: string) => void;
}

export function SidebarMenuItem({
  item,
  pathname,
  collapsed,
  expandedItems,
  hoveredItem,
  onMouseEnter,
  onMouseLeave,
  toggleItemExpanded,
}: SidebarMenuItemProps) {
  const itemKey = item.href || item.title;
  const isExpanded = expandedItems[itemKey] || hoveredItem === itemKey;
  const isActive = pathname === item.href;
  const hasActiveChild = item.children?.some(child => pathname === child.href);

  if (item.children && item.children.length > 0) {
    return (
      <ShadcnSidebarMenuItem
        key={itemKey}
        className="w-full"
        onMouseEnter={() => onMouseEnter(itemKey)}
        onMouseLeave={onMouseLeave}
      >
        <Collapsible open={isExpanded} className="w-full">
          <CollapsibleTrigger
            onClick={(e) => {
              e.preventDefault();
              toggleItemExpanded(itemKey);
            }}
            className="w-full"
            asChild
          >
            <SidebarMenuButton 
              variant="default"
              isActive={isActive || hasActiveChild}
              tooltip={collapsed ? item.title : undefined}
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              {!collapsed && <span>{item.title}</span>}
            </SidebarMenuButton>
          </CollapsibleTrigger>
          
          <CollapsibleContent className={collapsed ? "hidden" : ""}>
            <SidebarMenuSub className="ml-6 mt-1">
              {item.children.map((child) => (
                <NavLink key={child.href} to={child.href}>
                  {({ isActive }) => (
                    <SidebarMenuSubButton
                      isActive={isActive}
                    >
                      {child.icon && <child.icon className="h-4 w-4 mr-2" />}
                      <span>{child.title}</span>
                    </SidebarMenuSubButton>
                  )}
                </NavLink>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </ShadcnSidebarMenuItem>
    );
  }

  return (
    <ShadcnSidebarMenuItem key={item.href}>
      <NavLink to={item.href}>
        {({ isActive }) => (
          <SidebarMenuButton 
            isActive={isActive}
            tooltip={collapsed ? item.title : undefined}
            variant="default"
          >
            {item.icon && <item.icon className="h-4 w-4" />}
            {!collapsed && <span>{item.title}</span>}
          </SidebarMenuButton>
        )}
      </NavLink>
    </ShadcnSidebarMenuItem>
  );
}
