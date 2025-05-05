
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface MenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export function MenuToggle({ isOpen, onToggle, className = "" }: MenuToggleProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        className="md:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      {/* Desktop sidebar toggle using shadcn SidebarTrigger */}
      <SidebarTrigger className="hidden md:flex" />
    </div>
  );
}
