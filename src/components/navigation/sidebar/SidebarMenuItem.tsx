
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MenuItem } from "../types";
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
      <div 
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
            className={cn(
              "flex w-full items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
              (isActive || hasActiveChild) ? 
                "bg-accent text-accent-foreground font-medium" : 
                "hover:bg-accent/50 hover:text-accent-foreground"
            )}
          >
            {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
            {!collapsed && <span className="truncate">{item.title}</span>}
          </CollapsibleTrigger>
          
          <CollapsibleContent className={collapsed ? "hidden" : ""}>
            <div className="ml-6 mt-1 flex flex-col gap-1">
              {item.children.map((child) => (
                <NavLink 
                  key={child.href} 
                  to={child.href}
                  className={({ isActive }) => cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                    isActive ? 
                      "bg-accent text-accent-foreground font-medium" : 
                      "hover:bg-accent/50 hover:text-accent-foreground"
                  )}
                >
                  {child.icon && <child.icon className="h-4 w-4 shrink-0" />}
                  <span className="truncate">{child.title}</span>
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
      to={item.href}
      className={({ isActive }) => cn(
        "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
        isActive ? 
          "bg-accent text-accent-foreground font-medium" : 
          "hover:bg-accent/50 hover:text-accent-foreground"
      )}
    >
      {item.icon && (
        collapsed ? (
          <item.icon className="h-4 w-4 mx-auto" />
        ) : (
          <item.icon className="h-4 w-4 shrink-0" />
        )
      )}
      {!collapsed && <span className="truncate">{item.title}</span>}
      
      {/* Tooltip para modo collapsed */}
      {collapsed && (
        <div className="absolute left-full ml-2 hidden group-hover:flex px-2 py-1 bg-popover text-popover-foreground rounded z-50">
          {item.title}
        </div>
      )}
    </NavLink>
  );
}
