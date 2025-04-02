
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MenuItems } from "./MenuItems";

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-40 w-72 bg-card/95 backdrop-blur-sm border-r border-border/40 transition-transform duration-300 ease-in-out md:translate-x-0 shadow-lg", 
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="flex flex-col h-full">
        <div className="p-6 mt-2">
          <h1 className="text-xl font-bold">Gestão</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Simplificando a conformidade
          </p>
        </div>
        
        <nav className="flex-1 px-4 pb-4 overflow-y-auto">
          <MenuItems />
        </nav>
        
        <div className="p-4 mt-auto border-t border-border/30">
          <Button variant="outline" className="w-full justify-start">
            <FileText size={16} className="mr-2" />
            Exportar Relatório
          </Button>
        </div>
      </div>
    </div>
  );
}
