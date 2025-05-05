
import { SidebarMenuItem as ActualSidebarMenuItem } from './menu-item';
import type { SidebarMenuItemProps } from './menu-item/types';

export function SidebarMenuItem(props: SidebarMenuItemProps) {
  return <ActualSidebarMenuItem {...props} />;
}
