import { cn } from "@/lib/utils";
import { hrTabGroups } from "./HRTabConfig";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronDown, ChevronUp } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

type HRTabSelectProps = {
  tabGroups: typeof hrTabGroups;
  activeTab: string;
  setActiveTab: (value: string) => void;
};

export function HRTabSelect({
  tabGroups,
  activeTab,
  setActiveTab
}: HRTabSelectProps) {
  // Track which dropdown menus are open
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  // Find current active group
  const activeGroup = tabGroups.find(group => 
    group.subTabs?.some(tab => tab.id === activeTab) || group.id === activeTab
  );

  // Toggle dropdown menu
  const toggleMenu = (groupId: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  return (
    <div className="mb-6 w-full">
      <ScrollArea className="w-full">
        <div className="flex flex-wrap gap-2 p-4 border rounded-lg bg-card shadow-sm">
          {tabGroups.map(group => {
            // Check if this group contains the active tab
            const isActiveGroup = group.id === activeGroup?.id || 
              group.subTabs?.some(tab => tab.id === activeTab);

            // If group has no subTabs, render a simple button
            if (!group.subTabs || group.subTabs.length === 0) {
              return (
                <Tooltip key={group.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setActiveTab(group.id)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors",
                        activeTab === group.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/50 hover:bg-muted text-foreground"
                      )}
                    >
                      {group.icon && <span className="mr-1">{group.icon}</span>}
                      <span>{group.name}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-card border text-foreground">
                    <p>{group.name}</p>
                  </TooltipContent>
                </Tooltip>
              );
            }

            // Otherwise, render a dropdown for groups with subTabs
            return (
              <DropdownMenu key={group.id}>
                <DropdownMenuTrigger asChild>
                  <button
                    onClick={() => toggleMenu(group.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors",
                      isActiveGroup
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 hover:bg-muted text-foreground"
                    )}
                  >
                    {group.icon && <span className="mr-1">{group.icon}</span>}
                    <span>{group.name}</span>
                    {openMenus[group.id] ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 bg-popover border shadow-md z-[999]">
                  {group.subTabs?.map(tab => (
                    <DropdownMenuItem
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex items-center gap-2 cursor-pointer",
                        activeTab === tab.id && "bg-accent text-accent-foreground font-medium"
                      )}
                    >
                      {tab.icon && <span className="mr-1">{tab.icon}</span>}
                      {tab.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
