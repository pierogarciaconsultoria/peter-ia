
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MenuToggleProps {
  isOpen: boolean;
  toggleMenu: () => void;
  className?: string;
  toggleCollapsed?: () => void;
  isCollapsed?: boolean;
}

export function MenuToggle({ 
  isOpen, 
  toggleMenu, 
  className,
  toggleCollapsed,
  isCollapsed
}: MenuToggleProps) {
  return (
    <Button
      variant="ghost" 
      size="icon" 
      className={cn(
        "fixed top-5 left-5 z-50 md:hidden", 
        className
      )}
      onClick={toggleMenu}
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <Menu className={isOpen ? "rotate-90" : ""} />
    </Button>
  );
}
