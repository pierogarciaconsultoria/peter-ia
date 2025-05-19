
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

  // Corrigir a navegação para usar o objeto to em vez de string
  return (
    <div className="relative" onMouseEnter={() => onMouseEnter(itemKey)} onMouseLeave={onMouseLeave}>
      <NavLink 
        to={item.href}
        end={item.href === "/" || item.href === "/dashboard"}
        className={({ isActive }) => cn(
          "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
          isActive ? 
            "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : 
            "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        )}
        onClick={(e) => {
          // Logging para debug
          console.log(`Navegando para: ${item.href}`);
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
      
      {/* Tooltip para modo colapsado */}
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
