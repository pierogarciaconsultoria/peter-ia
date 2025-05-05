
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
  const isActive = pathname === item.href || item.children?.some(child => pathname === child.href);

  if (item.children && item.children.length > 0) {
    return (
      <div
        key={itemKey}
        className="w-full"
        onMouseEnter={() => onMouseEnter(itemKey)}
        onMouseLeave={onMouseLeave}
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
}
