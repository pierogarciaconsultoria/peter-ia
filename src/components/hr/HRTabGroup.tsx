
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { hrTabGroups } from "./HRTabConfig";

type HRTabGroupProps = {
  tabGroups: typeof hrTabGroups;
  activeTab: string;
  setActiveTab: (value: string) => void;
};

export function HRTabGroup({ tabGroups, activeTab, setActiveTab }: HRTabGroupProps) {
  // Convert the tab configuration into a flat list of tabs for display
  const allTabs = tabGroups.flatMap(group => 
    group.subTabs 
      ? group.subTabs.map(tab => ({ value: tab.id, label: tab.name }))
      : []
  );

  return (
    <div className="border rounded-md">
      <ScrollArea className="w-full">
        <div className="flex p-1 min-w-max">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex w-full h-auto flex-wrap bg-transparent p-0 gap-1">
              {allTabs.map(tab => (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value}
                  className="h-9 rounded-md px-3 py-1.5 whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}
