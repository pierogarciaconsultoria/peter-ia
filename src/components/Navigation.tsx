
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MenuToggle } from "./navigation/MenuToggle";
import { UserMenu } from "./navigation/UserMenu";
import { Sidebar } from "./navigation/Sidebar";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return <>
    <MenuToggle isOpen={isOpen} toggleMenu={() => setIsOpen(!isOpen)} />
    <UserMenu />
    <Sidebar isOpen={isOpen} />
  </>;
}

