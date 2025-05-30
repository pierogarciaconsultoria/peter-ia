
import { HRNavigationTabs } from "./HRNavigationTabs";
import { hrTabGroups } from "./HRTabConfig";

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
  return (
    <HRNavigationTabs 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
    />
  );
}
