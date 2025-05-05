
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/contexts/SidebarContext";

interface SidebarToggleProps {
  collapsed: boolean;
}

export function SidebarToggle({ collapsed }: SidebarToggleProps) {
  const { setCollapsed } = useSidebar();
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full flex justify-between items-center"
      onClick={toggleSidebar}
    >
      {collapsed ? (
        <ChevronsRight className="h-4 w-4 mx-auto" />
      ) : (
        <>
          <span className="text-sm font-medium">Recolher</span>
          <ChevronsLeft className="h-4 w-4" />
        </>
      )}
    </Button>
  );
}
