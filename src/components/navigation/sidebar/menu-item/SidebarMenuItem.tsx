
import { SidebarMenuItemProps } from "./types";
import { SidebarMenuItemSimple } from "./SidebarMenuItemSimple";
import { SidebarMenuItemWithChildren } from "./SidebarMenuItemWithChildren";

export function SidebarMenuItem(props: SidebarMenuItemProps) {
  const { item } = props;

  // Delegate to appropriate component based on whether item has children
  if (item.children && item.children.length > 0) {
    return <SidebarMenuItemWithChildren {...props} />;
  } else {
    return <SidebarMenuItemSimple {...props} />;
  }
}
