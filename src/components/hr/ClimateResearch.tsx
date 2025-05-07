
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function ClimateResearch() {
  const navigate = useNavigate();
  
  // Redirecionar para a página de pesquisa de clima usando query parameter
  useEffect(() => {
    navigate("/human-resources?activeTab=climate");
  }, [navigate]);
  
  return null;
}
