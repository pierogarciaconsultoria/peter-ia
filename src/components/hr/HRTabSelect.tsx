
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { hrTabGroups } from "./HRTabConfig";

type HRTabSelectProps = {
  tabGroups: typeof hrTabGroups;
  activeTab: string;
  setActiveTab: (value: string) => void;
};

export function HRTabSelect({ tabGroups, activeTab, setActiveTab }: HRTabSelectProps) {
  // Find current active group
  const activeGroup = tabGroups.find(group => 
    group.subTabs?.some(tab => tab.id === activeTab) || group.id === activeTab
  );

  return (
    <NavigationMenu className="mb-6 w-full">
      <NavigationMenuList className="flex flex-wrap space-x-1 border rounded-lg p-1 bg-white w-full justify-start overflow-x-auto">
        {tabGroups.map((group) => (
          <NavigationMenuItem key={group.id}>
            {group.subTabs ? (
              <>
                <NavigationMenuTrigger 
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium whitespace-nowrap",
                    activeGroup?.id === group.id && "bg-muted"
                  )}
                >
                  <span className="mr-1">{group.icon}</span>
                  {group.name}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="absolute top-full left-0 z-50">
                  <div className="grid gap-1 p-2 w-[280px] bg-white shadow-md">
                    {group.subTabs.map((subTab) => (
                      <NavigationMenuLink
                        key={subTab.id}
                        onClick={() => setActiveTab(subTab.id)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-muted",
                          activeTab === subTab.id && "bg-muted font-medium"
                        )}
                      >
                        <span className="mr-1">{subTab.icon}</span>
                        {subTab.name}
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink
                onClick={() => setActiveTab(group.id)}
                className={cn(
                  navigationMenuTriggerStyle(),
                  "flex items-center gap-2 px-3 py-2 text-sm font-medium whitespace-nowrap",
                  activeTab === group.id && "bg-muted"
                )}
              >
                <span className="mr-1">{group.icon}</span>
                {group.name}
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
