
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useSidebarState() {
  const { pathname } = useLocation();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Initialize expanded state based on the current path
  useEffect(() => {
    // Reset expanded states
    const newExpandedState: Record<string, boolean> = {};
    setExpandedItems(newExpandedState);
  }, [pathname]);

  // Handle mouse enter for an item
  const handleMouseEnter = (itemKey: string) => {
    setHoveredItem(itemKey);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  // Toggle an item's expanded state when clicked
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
