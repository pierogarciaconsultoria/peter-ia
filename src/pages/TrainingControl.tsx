
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

const TrainingControl = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRedirecting, setIsRedirecting] = useState(true);
  
  useEffect(() => {
    // Verificar se já estamos na URL correta para evitar redirecionamentos infinitos
    const isAlreadyOnCorrectTab = location.search.includes('activeTab=training');
    
    if (isAlreadyOnCorrectTab) {
      setIsRedirecting(false);
      return;
    }
    
    const redirectTimer = setTimeout(() => {
      // Redirect to the HR Development Tab with proper query parameter
      navigate("/human-resources?activeTab=training", { replace: true });
    }, 300);
    
    return () => clearTimeout(redirectTimer);
  }, [navigate, location.search]);
  
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
  
  return null; // Este componente vai redirecionar, então não precisa renderizar nada quando não está redirecionando
};

export default TrainingControl;
