
import { useState } from "react";
import { cn } from "@/lib/utils";
import { hrTabGroups } from "./HRTabConfig";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ChevronDown } from "lucide-react";

type HRNavigationTabsProps = {
  activeTab: string;
  onTabChange: (tabId: string) => void;
};

export function HRNavigationTabs({ activeTab, onTabChange }: HRNavigationTabsProps) {
  // Find current active group and tab
  const activeGroup = hrTabGroups.find(group => 
    group.subTabs?.some(tab => tab.id === activeTab) || group.id === activeTab
  );

  const activeSubTab = activeGroup?.subTabs?.find(tab => tab.id === activeTab);

  return (
    <div className="w-full border-b bg-background">
      {/* Main Groups Navigation */}
      <ScrollArea className="w-full">
        <div className="flex items-center px-4 py-3">
          <NavigationMenu className="w-full">
            <NavigationMenuList className="flex gap-1">
              <TooltipProvider>
                {hrTabGroups.map(group => {
                  const isActiveGroup = group.id === activeGroup?.id;
                  
                  // If group has no subTabs, render a simple button
                  if (!group.subTabs || group.subTabs.length === 0) {
                    return (
                      <Tooltip key={group.id}>
                        <TooltipTrigger asChild>
                          <Button
                            variant={activeTab === group.id ? "default" : "ghost"}
                            size="sm"
                            onClick={() => onTabChange(group.id)}
                            className="flex items-center gap-2 h-9"
                          >
                            {group.icon}
                            <span className="hidden sm:inline">{group.name}</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>{group.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  // Render navigation item with dropdown
                  return (
                    <NavigationMenuItem key={group.id}>
                      <NavigationMenuTrigger
                        className={cn(
                          "h-9 px-3 py-2 text-sm font-medium transition-colors",
                          isActiveGroup
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {group.icon}
                          <span className="hidden sm:inline">{group.name}</span>
                        </div>
                      </NavigationMenuTrigger>
                      
                      <NavigationMenuContent className="min-w-[200px] p-2">
                        <div className="grid gap-1">
                          {group.subTabs?.map(tab => (
                            <Button
                              key={tab.id}
                              variant={activeTab === tab.id ? "secondary" : "ghost"}
                              size="sm"
                              onClick={() => onTabChange(tab.id)}
                              className="justify-start gap-2 h-9"
                            >
                              {tab.icon}
                              <span>{tab.name}</span>
                            </Button>
                          ))}
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  );
                })}
              </TooltipProvider>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </ScrollArea>

      {/* Breadcrumb for active path */}
      {activeGroup && (
        <div className="px-4 py-2 bg-muted/30 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              {activeGroup.icon}
              <span>{activeGroup.name}</span>
            </div>
            {activeSubTab && (
              <>
                <span>/</span>
                <div className="flex items-center gap-1 text-foreground font-medium">
                  {activeSubTab.icon}
                  <span>{activeSubTab.name}</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
