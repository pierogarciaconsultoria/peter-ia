
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function ClimateResearch() {
  const navigate = useNavigate();
  
  // Redirecionar para a nova página de pesquisa de clima
  useEffect(() => {
    navigate("/human-resources?activeTab=climate");
  }, [navigate]);
  
  return null;
}
