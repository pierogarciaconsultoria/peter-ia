
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const TrainingControl = () => {
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(true);
  
  useEffect(() => {
    // Verificar se já estamos na URL correta para evitar redirecionamentos desnecessários
    if (window.location.href.includes('activeTab=training')) {
      setIsRedirecting(false);
      return;
    }
    
    const redirectTimer = setTimeout(() => {
      // Redirect to the HR Development Tab with proper query parameter
      navigate("/human-resources?activeTab=training");
    }, 300);
    
    return () => clearTimeout(redirectTimer);
  }, [navigate]);
  
  if (isRedirecting) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Redirecionando para o módulo de treinamentos...</p>
        </div>
      </div>
    );
  }
  
  return null; // This component will redirect, so no need to render anything when not redirecting
};

export default TrainingControl;
