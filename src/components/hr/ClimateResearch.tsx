
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function ClimateResearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // Verificar se já estamos na URL correta para evitar redirecionamentos infinitos
  useEffect(() => {
    // Se já estamos na página com o parâmetro climate, não redirecionar
    const isAlreadyOnCorrectTab = location.search.includes('activeTab=climate');
    
    if (isAlreadyOnCorrectTab) {
      setIsRedirecting(false);
      return;
    }
    
    setIsRedirecting(true);
    
    // Redirecionar para a página HR com a aba climate
    const redirectTimer = setTimeout(() => {
      navigate("/human-resources?activeTab=climate", { replace: true });
    }, 300);
    
    return () => clearTimeout(redirectTimer);
  }, [navigate, location.search]);
  
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
