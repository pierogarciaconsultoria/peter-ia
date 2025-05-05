
import { VariantProps } from "class-variance-authority";
import { sidebarMenuButtonVariants } from "./sidebar-menu";

export const SIDEBAR_COOKIE_NAME = "sidebar:state";
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
export const SIDEBAR_WIDTH = "16rem";
export const SIDEBAR_WIDTH_MOBILE = "18rem";
export const SIDEBAR_WIDTH_ICON = "3rem";
export const SIDEBAR_KEYBOARD_SHORTCUT = "b";

export type SidebarButtonVariantProps = VariantProps<typeof sidebarMenuButtonVariants>;

export type SidebarState = "expanded" | "collapsed";
export type SidebarCollapsibleMode = "offcanvas" | "icon" | "none";
export type SidebarVariant = "sidebar" | "floating" | "inset";
export type SidebarSide = "left" | "right";
