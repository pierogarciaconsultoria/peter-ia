
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
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
  // Find current active group
  const activeGroup = tabGroups.find(group => 
    group.subTabs?.some(tab => tab.id === activeTab) || group.id === activeTab
  );

  return (
    <NavigationMenu className="mb-6 w-full max-w-full">
      <NavigationMenuList className="flex w-full flex-wrap justify-between gap-1 border rounded-lg p-2 bg-card shadow-sm overflow-x-auto py-[10px] mx-0 px-4 md:px-[72px]">
        {tabGroups.map(group => (
          <NavigationMenuItem key={group.id} className="flex-1 min-w-[120px] mx-1">
            {group.subTabs ? (
              <>
                <NavigationMenuTrigger 
                  className={cn(
                    "flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium w-full whitespace-nowrap transition-colors",
                    activeGroup?.id === group.id ? "bg-muted text-primary" : "hover:bg-muted/50"
                  )}
                  aria-label={`Menu ${group.name}`}
                >
                  <span className="mr-1">{group.icon}</span>
                  <span>{group.name}</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="absolute top-full left-0 z-[100] w-[280px]">
                  <div className="grid gap-1 p-3 bg-popover border border-border rounded-md shadow-lg">
                    {group.subTabs.map(subTab => (
                      <NavigationMenuLink 
                        key={subTab.id} 
                        onClick={() => setActiveTab(subTab.id)} 
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer transition-colors",
                          activeTab === subTab.id 
                            ? "bg-primary/10 text-primary font-medium" 
                            : "hover:bg-muted text-foreground"
                        )}
                        role="menuitem"
                      >
                        <span className="mr-1">{subTab.icon}</span>
                        <span>{subTab.name}</span>
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
                  "flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium w-full whitespace-nowrap transition-colors",
                  activeTab === group.id ? "bg-primary/10 text-primary" : "hover:bg-muted/50"
                )}
                role="menuitem"
              >
                <span className="mr-1">{group.icon}</span>
                <span>{group.name}</span>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
