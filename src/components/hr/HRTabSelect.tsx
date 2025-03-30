
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type TabGroup = {
  label: string;
  tabs: {
    value: string;
    label: string;
  }[];
};

type HRTabSelectProps = {
  tabGroups: TabGroup[];
  activeTab: string;
  setActiveTab: (value: string) => void;
};

export function HRTabSelect({ tabGroups, activeTab, setActiveTab }: HRTabSelectProps) {
  return (
    <div className="mb-4">
      <Select value={activeTab} onValueChange={setActiveTab}>
        <SelectTrigger className="w-full md:w-[300px]">
          <SelectValue placeholder="Selecione uma seção" />
        </SelectTrigger>
        <SelectContent>
          {tabGroups.map((group) => (
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
