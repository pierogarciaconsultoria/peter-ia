
import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";
import { menuItems } from "./MenuItems";
import { Home } from "lucide-react";

// Find menu item by pathname
const findMenuItemByPath = (path: string) => {
  // Check for exact match first
  for (const item of menuItems) {
    if (item.href === path) {
      return { item, parent: null };
    }

    // Check children
    if (item.children) {
      for (const child of item.children) {
        if (child.href === path) {
          return { item: child, parent: item };
        }
      }
    }
  }

  // If no exact match, try to find the closest parent
  // For paths like /human-resources/employees when we only have /human-resources in the menu
  for (const item of menuItems) {
    if (path.startsWith(item.href) && item.href !== '/') {
      return { item, parent: null };
    }

    // Check children for partial matches
    if (item.children) {
      for (const child of item.children) {
        if (path.startsWith(child.href) && child.href !== '/') {
          return { item: child, parent: item };
        }
      }
    }
  }

  return null;
};

export function BreadcrumbNavigation() {
  const location = useLocation();
  
  const breadcrumbs = useMemo(() => {
    const result = findMenuItemByPath(location.pathname);
    
    if (!result) {
      // Default to dashboard if path not found in menu
      return [{ title: "Dashboard", href: "/dashboard", icon: Home }];
    }
    
    const breadcrumbItems = [];
    
    // Always include dashboard as first item
    breadcrumbItems.push({ title: "Dashboard", href: "/dashboard", icon: Home });
    
    // Add parent if exists
    if (result.parent) {
      breadcrumbItems.push({
        title: result.parent.title,
        href: result.parent.href,
        icon: result.parent.icon
      });
    }
    
    // Add current page
    breadcrumbItems.push({
      title: result.item.title,
      href: result.item.href,
      icon: result.item.icon
    });
    
    // Special case for human resources sub-routes
    if (location.pathname.startsWith('/human-resources/') && breadcrumbItems.length === 2) {
      // If we're at a HR child route but only have the dashboard and HR in breadcrumbs
      // Add "Recursos Humanos" as an intermediate breadcrumb
      const hrParts = location.pathname.split('/');
      if (hrParts.length >= 3) {
        const lastPart = hrParts[2];
        let title = lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace(/-/g, ' ');
        
        // Handle specific HR routes with better titles
        switch(lastPart) {
          case 'employees':
            title = 'Funcionários';
            break;
          case 'positions':
            title = 'Cargos';
            break;
          case 'requests':
            title = 'Solicitações';
            break;
        }
        
        breadcrumbItems.push({
          title,
          href: location.pathname,
          icon: null
        });
      }
    }
    
    return breadcrumbItems;
  }, [location.pathname]);

  // Don't show breadcrumbs on main dashboard
  if (location.pathname === '/dashboard') {
    return null;
  }

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => {
          const isLastItem = index === breadcrumbs.length - 1;
          
          return (
            <React.Fragment key={item.href}>
              <BreadcrumbItem>
                {isLastItem ? (
                  <BreadcrumbPage className="flex items-center">
                    {item.icon && <item.icon className="mr-1 h-4 w-4" />}
                    {item.title}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.href} className="flex items-center">
                    {item.icon && <item.icon className="mr-1 h-4 w-4" />}
                    {item.title}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLastItem && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
