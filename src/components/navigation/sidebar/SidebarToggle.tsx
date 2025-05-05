
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
      className="ml-auto w-full flex justify-between mb-2"
      onClick={toggleSidebar}
    >
      {collapsed ? (
        <>
          <span className="sr-only">Expandir</span>
          <ChevronsRight className="h-4 w-4" />
        </>
      ) : (
        <>
          <span>Recolher</span>
          <ChevronsLeft className="h-4 w-4" />
        </>
      )}
    </Button>
  );
}
