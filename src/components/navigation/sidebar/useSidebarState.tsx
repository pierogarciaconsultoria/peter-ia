
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useSidebarState() {
  const { pathname } = useLocation();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Atualizar estados quando a rota muda
  useEffect(() => {
    console.log("Pathname changed to:", pathname);
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
    setExpandedItems(prev => ({
      ...prev,
      [itemKey]: !prev[itemKey]
    }));
  };

  return {
    pathname,
    expandedItems,
    hoveredItem,
    handleMouseEnter,
    handleMouseLeave,
    toggleItemExpanded
  };
}
