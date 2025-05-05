
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarToggleProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

export function SidebarToggle({ collapsed, toggleSidebar }: SidebarToggleProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full flex justify-between items-center mb-2"
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
