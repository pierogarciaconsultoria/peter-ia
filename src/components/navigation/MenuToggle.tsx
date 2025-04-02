
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MenuToggleProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

export function MenuToggle({ isOpen, toggleMenu }: MenuToggleProps) {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="fixed top-4 left-4 z-50 md:hidden" 
      onClick={toggleMenu}
    >
      {isOpen ? <X size={20} /> : <Menu size={20} />}
    </Button>
  );
}
