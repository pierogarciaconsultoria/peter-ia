
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutGrid,
  ClipboardList,
  Settings,
  Users,
  BarChart,
  FileText,
  Search,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 right-4 z-50"
        onClick={toggleMenu}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>
      
      {/* Navigation sidebar */}
      <div 
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-card/80 backdrop-blur-sm border-r border-border/50 p-4 flex flex-col z-40 transition-transform duration-300 ease-in-out",
          "md:translate-x-0",
          isMenuOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="flex items-center space-x-2 mb-8 mt-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <FileText size={18} className="text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold">ISO 9001:2015</h1>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-8 bg-background/50"
          />
        </div>
        
        <nav className="space-y-1 flex-1">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <a href="/" className="flex items-center space-x-3">
              <LayoutGrid size={18} />
              <span>Dashboard</span>
            </a>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <a href="/" className="flex items-center space-x-3">
              <ClipboardList size={18} />
              <span>Requirements</span>
            </a>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <a href="/" className="flex items-center space-x-3">
              <FileText size={18} />
              <span>Documents</span>
            </a>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <a href="/" className="flex items-center space-x-3">
              <Users size={18} />
              <span>Team</span>
            </a>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <a href="/" className="flex items-center space-x-3">
              <BarChart size={18} />
              <span>Reports</span>
            </a>
          </Button>
        </nav>
        
        <div className="pt-6 border-t border-border/50 mt-6">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <a href="/" className="flex items-center space-x-3">
              <Settings size={18} />
              <span>Settings</span>
            </a>
          </Button>
        </div>
      </div>
      
      {/* Backdrop for mobile */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={toggleMenu}
        />
      )}
    </>
  );
}
