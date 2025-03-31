
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { hrTabGroups } from "./HRTabConfig";

type HRTabSelectProps = {
  tabGroups: typeof hrTabGroups;
  activeTab: string;
  setActiveTab: (value: string) => void;
};

export function HRTabSelect({ tabGroups, activeTab, setActiveTab }: HRTabSelectProps) {
  // Group tabs by their parent category
  const groupedTabs = tabGroups.map(group => ({
    label: group.name,
    tabs: group.subTabs 
      ? group.subTabs.map(tab => ({ value: tab.id, label: tab.name }))
      : group.href 
        ? [{ value: group.id, label: group.name }]
        : []
  }));

  return (
    <div className="mb-4">
      <Select value={activeTab} onValueChange={setActiveTab}>
        <SelectTrigger className="w-full md:w-[300px]">
          <SelectValue placeholder="Selecione uma seção" />
        </SelectTrigger>
        <SelectContent>
          {groupedTabs.map((group) => (
            <div key={group.label}>
              <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                {group.label}
              </div>
              {group.tabs.map((tab) => (
                <SelectItem key={tab.value} value={tab.value}>
                  {tab.label}
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
