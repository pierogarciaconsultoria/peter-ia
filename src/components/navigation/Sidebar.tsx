
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { menuItems } from "./MenuItems";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  className?: string;
}

export function Sidebar({ isOpen, className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const toggleCollapsed = () => {
    setIsCollapsed(prev => !prev);
  };

  // Controla a visibilidade da barra ao passar o mouse
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div 
      ref={sidebarRef}
      className={cn(
        "fixed inset-y-0 left-0 z-40 bg-card/95 backdrop-blur-sm border-r border-border/40 transition-all duration-300 ease-in-out shadow-lg", 
        isOpen ? "translate-x-0" : "-translate-x-full",
        isCollapsed && !isHovered ? "md:w-20" : "md:w-72",
        "md:translate-x-0",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col h-full">
        <div className={cn(
          "p-6 mt-2 flex items-center", 
          isCollapsed && !isHovered && "justify-center p-4"
        )}>
          <div className={cn(
            "transition-opacity", 
            isCollapsed && !isHovered ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
          )}>
            <h1 className="text-xl font-bold">Gestão</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Simplificando a conformidade
            </p>
          </div>
          
          {isCollapsed && !isHovered && (
            <h1 className="text-xl font-bold">G</h1>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-auto hidden md:flex"
            onClick={toggleCollapsed}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        </div>
        
        <nav className={cn(
          "flex-1 overflow-y-auto",
          isCollapsed && !isHovered ? "px-2" : "px-4"
        )}>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full",
                    isCollapsed && !isHovered ? "justify-center px-2" : "justify-start"
                  )}
                  asChild
                >
                  <a href={item.href} title={isCollapsed && !isHovered ? item.title : undefined}>
                    <item.icon size={16} className={isCollapsed && !isHovered ? "mr-0" : "mr-2"} />
                    <span className={isCollapsed && !isHovered ? "sr-only" : ""}>
                      {item.title}
                    </span>
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className={cn(
          "p-4 mt-auto border-t border-border/30",
          isCollapsed && !isHovered && "flex justify-center"
        )}>
          <Button 
            variant="outline" 
            className={cn(
              isCollapsed && !isHovered ? "w-10 h-10 p-0 justify-center" : "w-full justify-start"
            )}
            title={isCollapsed && !isHovered ? "Exportar Relatório" : undefined}
          >
            <FileText size={16} className={isCollapsed && !isHovered ? "mr-0" : "mr-2"} />
            <span className={isCollapsed && !isHovered ? "sr-only" : ""}>
              Exportar Relatório
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
