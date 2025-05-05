
import { MenuItem } from "../../types";

export interface SidebarMenuItemProps {
  item: MenuItem;
  pathname: string;
  collapsed: boolean;
  expandedItems: Record<string, boolean>;
  hoveredItem: string | null;
  onMouseEnter: (itemKey: string) => void;
  onMouseLeave: () => void;
  toggleItemExpanded: (itemKey: string) => void;
}
