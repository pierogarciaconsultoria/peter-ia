
import { cn } from "@/lib/utils";
import { hrTabGroups } from "./HRTabConfig";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
  // Find current active group
  const activeGroup = tabGroups.find(group => 
    group.subTabs?.some(tab => tab.id === activeTab) || group.id === activeTab
  );

  // Flatten all tabs for direct access
  const allTabs = tabGroups.flatMap(group => 
    group.subTabs 
      ? group.subTabs.map(tab => ({ ...tab, groupId: group.id, groupName: group.name }))
      : [{ id: group.id, name: group.name, component: group.component, icon: group.icon, groupId: group.id, groupName: group.name }]
  );

  return (
    <div className="mb-6 w-full">
      <ScrollArea className="w-full">
        <div className="flex flex-wrap gap-2 p-4 border rounded-lg bg-card shadow-sm">
          {allTabs.map(tab => (
            <Tooltip key={tab.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 hover:bg-muted text-foreground"
                  )}
                >
                  {tab.icon && <span className="mr-1">{tab.icon}</span>}
                  <span>{tab.name}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-card border text-foreground">
                <p>{tab.groupName} - {tab.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
