
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AuthenticationRequired } from "@/components/auth/AuthenticationRequired";

const TrainingControl = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRedirecting, setIsRedirecting] = useState(true);
  
  useEffect(() => {
    // Verificar se já estamos na URL correta para evitar redirecionamentos infinitos
    if (location.pathname === "/human-resources" && location.search.includes('activeTab=training')) {
      console.log("Já estamos na página de treinamentos");
      setIsRedirecting(false);
      return;
    }
    
    // Só redireciona se estivermos no caminho específico do TrainingControl
    if (location.pathname === "/training-control") {
      console.log("Redirecionando para o módulo de treinamentos");
      navigate("/human-resources?activeTab=training", { replace: true });
    } else {
      setIsRedirecting(false);
    }
    
    // Usando um timeout para garantir que o estado seja atualizado mesmo se o redirecionamento falhar
    const safetyTimeout = setTimeout(() => {
      setIsRedirecting(false);
    }, 1500);
    
    return () => clearTimeout(safetyTimeout);
  }, [navigate, location.pathname, location.search]);
  
  if (isRedirecting) {
    return (
      <AuthenticationRequired>
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Redirecionando para o módulo de treinamentos...</p>
          </div>
        </div>
      </AuthenticationRequired>
    );
  }
  
  // Se não estiver mais redirecionando e estamos na rota de treinamento
  // mas não na página de HR com activeTab=training, algo deu errado
  if (location.pathname === "/training-control") {
    return (
      <AuthenticationRequired>
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center space-y-4">
            <p className="text-lg font-medium">Falha no redirecionamento</p>
            <button 
              onClick={() => navigate("/human-resources?activeTab=training", { replace: true })}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Ir para Treinamentos
            </button>
          </div>
        </div>
      </AuthenticationRequired>
    );
  }
  
  return null; // Não renderiza nada se estiver na página correta
};

export default TrainingControl;
