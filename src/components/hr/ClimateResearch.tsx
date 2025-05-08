
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function ClimateResearch() {
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(true);
  
  // Redirecionar para a página de pesquisa de clima usando query parameter
  useEffect(() => {
    // Verifica se já estamos na página correta com o parâmetro correto
    const currentUrl = window.location.href;
    
    if (!currentUrl.includes('activeTab=climate')) {
      const timer = setTimeout(() => {
        navigate("/human-resources?activeTab=climate");
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      setIsRedirecting(false);
    }
  }, [navigate]);
  
  if (isRedirecting) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Redirecionando para pesquisa de clima...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pesquisa de Clima Organizacional</h2>
      </div>
      
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Módulo em desenvolvimento</h3>
        <p className="text-muted-foreground">
          O módulo de Pesquisa de Clima Organizacional está em desenvolvimento.
          Em breve você poderá criar e gerenciar pesquisas de clima aqui.
        </p>
      </Card>
    </div>
  );
}
