
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/contexts/SidebarContext";

interface MenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export function MenuToggle({ isOpen, onToggle, className = "" }: MenuToggleProps) {
  const { collapsed, setCollapsed } = useSidebar();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`fixed top-5 left-5 z-50 flex items-center gap-1 ${className}`}>
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        className="md:hidden"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      {/* Desktop sidebar toggle button is now inside Sidebar component */}
    </div>
  );
}
