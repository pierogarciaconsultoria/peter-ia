
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MenuToggle } from "./navigation/MenuToggle";
import { UserMenu } from "./navigation/UserMenu";
import { Sidebar } from "./navigation/Sidebar";
import { NotificationCenter } from "./notifications/NotificationCenter";
import { useScrollDirection } from "@/hooks/useScrollDirection";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { visible } = useScrollDirection();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      <MenuToggle 
        isOpen={isOpen} 
        toggleMenu={() => setIsOpen(!isOpen)} 
        className={`transition-opacity duration-300 ${!visible ? 'opacity-0' : 'opacity-100'}`}
      />
      <div className="fixed top-5 right-5 z-50 flex items-center gap-2">
        <NotificationCenter />
        <UserMenu />
      </div>
      <Sidebar 
        isOpen={isOpen} 
        className={`transition-transform duration-300 ${!visible && !isOpen ? '-translate-y-full md:translate-y-0 md:-translate-x-full' : ''}`} 
      />
    </>
  );
}
