
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MenuItem } from "../../types";
import { SidebarMenuItemProps } from "./types";

export function SidebarMenuItemSimple({
  item,
  pathname,
  collapsed,
  hoveredItem,
  onMouseEnter,
  onMouseLeave,
}: SidebarMenuItemProps) {
  const itemKey = item.href || item.title;

  // Fix the navigation route to handle both absolute and relative paths
  const getNavRoute = () => {
    // If it's already an absolute path, return it directly
    if (item.href?.startsWith('/')) {
      return item.href;
    }
    
    // If it's a relative path or undefined, make it absolute
    return item.href ? `/${item.href}` : '/';
  };

  const navRoute = getNavRoute();
  
  // Log navigation routes for debugging
  console.log(`Item: ${item.title}, Route: ${navRoute}, Current Path: ${pathname}`);
  
  // Determine if this item should be marked as active
  const isExactMatch = pathname === navRoute;
  const isParentMatch = pathname.startsWith(navRoute) && 
                        pathname.length > navRoute.length && 
                        pathname.charAt(navRoute.length) === '/';
  const isActive = isExactMatch || (navRoute !== '/' && isParentMatch);

  return (
    <div 
      className="relative" 
      onMouseEnter={() => onMouseEnter(itemKey)} 
      onMouseLeave={onMouseLeave}
    >
      <NavLink 
        to={navRoute}
        end={navRoute === "/" || navRoute === "/dashboard"}
        className={({ isActive: linkActive }) => cn(
          "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
          (linkActive || isActive) ? 
            "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : 
            "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        )}
        onClick={(e) => {
          // Log navigation for debugging
          console.log(`Navegando para: ${navRoute} (de ${pathname})`);
        }}
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
      {collapsed && hoveredItem === itemKey && (
        <div className={cn(
          "absolute left-full top-0 ml-2 min-w-[180px] rounded-md border border-sidebar-border bg-sidebar p-2 shadow-md z-50"
        )}>
          <div className="px-3 py-2 font-medium">{item.title}</div>
        </div>
      )}
    </div>
  );
}
