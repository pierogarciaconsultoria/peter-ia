
import * as React from "react";
import { cn } from "@/lib/utils";

export const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn("px-2 py-1 group/sidebar-group", className)}
      {...props}
    />
  );
});
SidebarGroup.displayName = "SidebarGroup";

export const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "mb-1 px-2 text-xs font-medium leading-6 text-sidebar-foreground/60 group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:-mt-10 group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  );
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";

export const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group-content"
      className={cn("space-y-0.5", className)}
      {...props}
    />
  );
});
SidebarGroupContent.displayName = "SidebarGroupContent";
