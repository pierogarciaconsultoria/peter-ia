
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
      location.pathname === "/auth" ||
      location.pathname === "/dashboard") {
    return null;
  }
  
  return (
    <Button
      variant="outline"
      size="sm"
      className="hidden md:flex"
      onClick={() => navigate("/")}
      title="Voltar para o Dashboard"
    >
      <Home className="h-4 w-4 mr-2" />
      Dashboard
    </Button>
  );
}
