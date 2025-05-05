
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeft } from "lucide-react";

interface MenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export function MenuToggle({ isOpen, onToggle, className }: MenuToggleProps) {
  return (
    <Button 
      variant="ghost" 
      size="icon"
      className={className}
      onClick={onToggle}
    >
      {isOpen ? (
        <PanelLeftClose className="h-5 w-5" />
      ) : (
        <PanelLeft className="h-5 w-5" />
      )}
      <span className="sr-only">
        {isOpen ? "Collapse sidebar" : "Expand sidebar"}
      </span>
    </Button>
  );
}
