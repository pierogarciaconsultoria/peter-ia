
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { hrTabGroups } from "./HRTabConfig";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type HRTabGroupProps = {
  tabGroups: typeof hrTabGroups;
  activeTab: string;
  setActiveTab: (value: string) => void;
};

export function HRTabGroup({ tabGroups, activeTab, setActiveTab }: HRTabGroupProps) {
  // Find the active tab group
  const activeGroupId = tabGroups.find(group => 
    group.subTabs?.some(tab => tab.id === activeTab)
  )?.id;

  // Get subtabs for the active group only
  const activeGroupTabs = tabGroups
    .find(group => group.id === activeGroupId)
    ?.subTabs || [];

  return (
    <div className="border rounded-md">
      <ScrollArea className="w-full">
        <div className="flex p-2 min-w-max">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex w-full h-auto bg-transparent p-1 gap-1">
              {activeGroupTabs.map(tab => (
                <Tooltip key={tab.id}>
                  <TooltipTrigger asChild>
                    <TabsTrigger 
                      value={tab.id}
                      className="flex items-center gap-2 h-10 rounded-md px-4 py-2 whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      {tab.icon && <span className="hidden md:inline">{tab.icon}</span>}
                      <span>{tab.name}</span>
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tab.name}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}
