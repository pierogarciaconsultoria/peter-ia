
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export function BackToHomeButton() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Don't show on the main dashboard or landing pages
  if (location.pathname === "/" || 
      location.pathname === "/landing" || 
      location.pathname === "/auth") {
    return null;
  }
  
  return (
    <Button
      variant="outline"
      size="sm"
      className="fixed top-5 left-20 z-50 md:left-72 transition-all duration-300"
      onClick={() => navigate("/")}
      title="Voltar para o Dashboard"
    >
      <Home className="h-4 w-4 mr-2" />
      Dashboard
    </Button>
  );
}
