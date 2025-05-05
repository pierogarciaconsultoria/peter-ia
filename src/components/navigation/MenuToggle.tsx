
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface MenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export function MenuToggle({ isOpen, onToggle, className }: MenuToggleProps) {
  return (
    <SidebarTrigger 
      className={className}
      onClick={onToggle}
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle menu</span>
    </SidebarTrigger>
  );
}
