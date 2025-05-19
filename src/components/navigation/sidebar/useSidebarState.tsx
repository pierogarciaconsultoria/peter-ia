
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useSidebarState() {
  const { pathname } = useLocation();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeRoute, setActiveRoute] = useState<string>(pathname);

  // Atualizar estados quando a rota muda
  useEffect(() => {
    console.log("Pathname changed to:", pathname);
    setActiveRoute(pathname);
    
    // Auto-expand parent items if current path is a child
    const pathParts = pathname.split('/').filter(Boolean);
    if (pathParts.length > 1) {
      const parentPath = `/${pathParts[0]}`;
      setExpandedItems(prev => ({
        ...prev,
        [parentPath]: true
      }));
    }
  }, [pathname]);

  // Lidar com o hover em um item
  const handleMouseEnter = (itemKey: string) => {
    setHoveredItem(itemKey);
  };

  // Lidar com o mouse deixando o item
  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  // Alternar o estado expandido de um item quando clicado
  const toggleItemExpanded = (itemKey: string) => {
    console.log("Toggling expanded state for:", itemKey);
    setExpandedItems(prev => ({
      ...prev,
      [itemKey]: !prev[itemKey]
    }));
  };

  // Check if an item is active based on pathname
  const isItemActive = (itemPath: string): boolean => {
    if (!itemPath) return false;
    
    // Log para debug
    console.log(`Verificando se ${itemPath} está ativo. Pathname atual: ${pathname}`);
    
    // Exact match
    if (pathname === itemPath) {
      console.log(`Exata correspondência para ${itemPath}`);
      return true;
    }
    
    // Match for index routes with trailing slash
    if (pathname === `${itemPath}/` || `${pathname}/` === itemPath) {
      console.log(`Correspondência com barra para ${itemPath}`);
      return true;
    }
    
    // Parent path match for nested routes
    const isParentPath = pathname.startsWith(itemPath) && 
                        (pathname.charAt(itemPath.length) === '/' || 
                        itemPath === '/');
                        
    if (isParentPath) {
      console.log(`${itemPath} é rota pai de ${pathname}`);
    }
    
    return isParentPath;
  };

  return {
    pathname,
    activeRoute,
    expandedItems,
    hoveredItem,
    handleMouseEnter,
    handleMouseLeave,
    toggleItemExpanded,
    isItemActive
  };
}
