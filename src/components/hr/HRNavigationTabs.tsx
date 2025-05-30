
import { useState } from "react";
import { cn } from "@/lib/utils";
import { hrTabGroups } from "./HRTabConfig";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
        <div className="flex items-center gap-2 px-4 py-3">
          {hrTabGroups.map(group => {
            const isActiveGroup = group.id === activeGroup?.id;
            
            // If group has no subTabs, render a simple button
            if (!group.subTabs || group.subTabs.length === 0) {
              return (
                <Button
                  key={group.id}
                  variant={activeTab === group.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onTabChange(group.id)}
                  className="flex items-center gap-2 h-9 whitespace-nowrap"
                >
                  {group.icon}
                  <span className="hidden sm:inline">{group.name}</span>
                </Button>
              );
            }

            // Render dropdown for groups with subTabs
            return (
              <DropdownMenu key={group.id}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={isActiveGroup ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center gap-2 h-9 whitespace-nowrap"
                  >
                    {group.icon}
                    <span className="hidden sm:inline">{group.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent 
                  className="min-w-[200px] bg-background border shadow-lg z-50"
                  align="start"
                >
                  {group.subTabs?.map(tab => (
                    <DropdownMenuItem
                      key={tab.id}
                      onClick={() => onTabChange(tab.id)}
                      className={cn(
                        "flex items-center gap-2 cursor-pointer",
                        activeTab === tab.id && "bg-accent text-accent-foreground font-medium"
                      )}
                    >
                      {tab.icon}
                      <span>{tab.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          })}
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
