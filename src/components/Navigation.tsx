
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MenuToggle } from "./navigation/MenuToggle";
import { UserMenu } from "./navigation/UserMenu";
import { Sidebar } from "./navigation/Sidebar";
import { BackToHomeButton } from "./navigation/BackToHomeButton";
import { NotificationCenter } from "./notifications/NotificationCenter";
import { useScrollDirection } from "@/hooks/useScrollDirection";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { visible } = useScrollDirection();

  const toggleCollapsed = () => {
    setIsCollapsed(prev => !prev);
  };

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
        toggleCollapsed={toggleCollapsed}
        isCollapsed={isCollapsed}
      />
      <BackToHomeButton />
      <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-72'}`}>
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
