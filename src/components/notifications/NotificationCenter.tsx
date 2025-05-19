
import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    toast.info("Funcionalidade de notificações temporariamente desabilitada.");
    setIsOpen(false);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative p-2" aria-label="Notificações" onClick={handleClick}>
                <Bell className="h-5 w-5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <ScrollArea className="h-[100px]">
                <div className="flex items-center justify-center p-4">
                  <span className="text-sm text-gray-500">Notificações temporariamente desabilitadas</span>
                </div>
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipTrigger>
        <TooltipContent>
          <p>Notificações desabilitadas temporariamente</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
