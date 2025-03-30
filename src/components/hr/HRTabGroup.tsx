
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

type TabGroup = {
  label: string;
  tabs: {
    value: string;
    label: string;
  }[];
};

type HRTabGroupProps = {
  tabGroups: TabGroup[];
  activeTab: string;
  setActiveTab: (value: string) => void;
};

export function HRTabGroup({ tabGroups, activeTab, setActiveTab }: HRTabGroupProps) {
  return (
    <div className="border rounded-md">
      <ScrollArea className="w-full">
        <div className="flex p-1 min-w-max">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex w-full h-auto flex-wrap bg-transparent p-0 gap-1">
              {tabGroups.flatMap(group => group.tabs).map(tab => (
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
