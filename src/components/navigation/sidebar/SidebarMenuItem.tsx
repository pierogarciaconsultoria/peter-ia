
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MenuItem } from "../types";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

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
  const hasActiveChild = item.children?.some(child => 
    pathname === child.href || child.children?.some(subchild => pathname === subchild.href)
  );

  if (item.children && item.children.length > 0) {
    return (
      <div 
        className="relative w-full"
        onMouseEnter={() => onMouseEnter(itemKey)}
        onMouseLeave={onMouseLeave}
      >
        <Collapsible open={collapsed ? hoveredItem === itemKey : isExpanded} className="w-full">
          <CollapsibleTrigger
            onClick={(e) => {
              e.preventDefault();
              if (!collapsed) {
                toggleItemExpanded(itemKey);
              }
            }}
            className={cn(
              "flex w-full items-center justify-between px-3 py-2 rounded-md text-sm transition-colors",
              (isActive || hasActiveChild) ? 
                "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : 
                "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            )}
          >
            <div className="flex items-center gap-2">
              {item.icon && (
                collapsed ? (
                  <item.icon className="h-5 w-5 mx-auto" />
                ) : (
                  <item.icon className="h-5 w-5 shrink-0" />
                )
              )}
              {!collapsed && <span className="truncate">{item.title}</span>}
            </div>
            {!collapsed && <ChevronDown className="h-4 w-4 shrink-0 transition-transform" style={{ transform: isExpanded ? 'rotate(-180deg)' : 'rotate(0deg)' }} />}
          </CollapsibleTrigger>
          
          {collapsed ? (
            <div className={cn(
              "absolute left-full top-0 ml-2 min-w-[200px] max-h-[600px] overflow-y-auto rounded-md border border-sidebar-border bg-sidebar p-2 shadow-md z-50",
              hoveredItem === itemKey ? "block" : "hidden"
            )}>
              <div className="font-medium text-sm mb-2 px-3 py-1 text-sidebar-foreground/60">
                {item.title}
              </div>
              {item.children.map((child) => (
                <div key={child.href || child.title} className="mb-1">
                  {child.children && child.children.length > 0 ? (
                    <div className="space-y-1">
                      <div className="px-3 py-2 text-sm font-medium text-sidebar-foreground">
                        {child.icon && <child.icon className="h-4 w-4 mr-2 inline" />}
                        {child.title}
                      </div>
                      <div className="pl-4">
                        {child.children.map(subchild => (
                          <NavLink 
                            key={subchild.href} 
                            to={subchild.href}
                            className={({ isActive }) => cn(
                              "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                              isActive ? 
                                "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : 
                                "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                            )}
                          >
                            {subchild.icon && <subchild.icon className="h-4 w-4 shrink-0" />}
                            <span className="truncate">{subchild.title}</span>
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <NavLink 
                      to={child.href}
                      className={({ isActive }) => cn(
                        "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                        isActive ? 
                          "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : 
                          "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      )}
                    >
                      {child.icon && <child.icon className="h-4 w-4 shrink-0" />}
                      <span className="truncate">{child.title}</span>
                    </NavLink>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <CollapsibleContent>
              <div className="ml-6 mt-1 flex flex-col gap-1">
                {item.children.map((child) => (
                  <div key={child.href || child.title} className="mb-1">
                    {child.children && child.children.length > 0 ? (
                      <div className="space-y-1">
                        <div className="px-3 py-1.5 text-sm font-medium text-sidebar-foreground/80">
                          {child.icon && <child.icon className="h-4 w-4 mr-2 inline" />}
                          {child.title}
                        </div>
                        <div className="pl-4 flex flex-col gap-1">
                          {child.children.map(subchild => (
                            <NavLink 
                              key={subchild.href} 
                              to={subchild.href}
                              className={({ isActive }) => cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                                isActive ? 
                                  "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : 
                                  "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                              )}
                            >
                              {subchild.icon && <subchild.icon className="h-4 w-4 shrink-0" />}
                              <span className="truncate">{subchild.title}</span>
                            </NavLink>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <NavLink 
                        to={child.href}
                        className={({ isActive }) => cn(
                          "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                          isActive ? 
                            "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : 
                            "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                        )}
                      >
                        {child.icon && <child.icon className="h-4 w-4 shrink-0" />}
                        <span className="truncate">{child.title}</span>
                      </NavLink>
                    )}
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          )}
        </Collapsible>
      </div>
    );
  }

  return (
    <div className="relative" onMouseEnter={() => onMouseEnter(itemKey)} onMouseLeave={onMouseLeave}>
      <NavLink 
        to={item.href}
        className={({ isActive }) => cn(
          "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
          isActive ? 
            "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : 
            "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        )}
      >
        {item.icon && (
          collapsed ? (
            <item.icon className="h-5 w-5 mx-auto" />
          ) : (
            <item.icon className="h-5 w-5 shrink-0" />
          )
        )}
        {!collapsed && <span className="truncate">{item.title}</span>}
      </NavLink>
      
      {/* Tooltip for collapsed mode */}
      {collapsed && (
        <div className={cn(
          "absolute left-full top-0 ml-2 min-w-[180px] rounded-md border border-sidebar-border bg-sidebar p-2 shadow-md z-50",
          hoveredItem === itemKey ? "block" : "hidden"
        )}>
          <div className="px-3 py-2 font-medium">{item.title}</div>
        </div>
      )}
    </div>
  );
}
