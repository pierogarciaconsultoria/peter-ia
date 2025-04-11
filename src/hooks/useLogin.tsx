
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { isLovableEditor, shouldGrantFreeAccess, getEnvironmentInfo } from "@/utils/lovableEditorDetection";

export const useLogin = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  
  // Use the centralized Lovable editor detection
  const isEditor = isLovableEditor();
  // Verifica se o acesso gratuito está habilitado
  const isFreeAccessEnabled = shouldGrantFreeAccess();
  // Obtém informações do ambiente para logging
  const environmentInfo = getEnvironmentInfo();
    
  // Automatically redirect to dashboard if in Lovable editor or free access mode
  useEffect(() => {
    if (isEditor || isFreeAccessEnabled) {
      console.log(`Acesso total concedido - redirecionando para dashboard (${environmentInfo})`);
      navigate("/");
    }
  }, [isEditor, isFreeAccessEnabled, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditor || isFreeAccessEnabled) {
      navigate("/");
      return;
    }
    
    setLoading(true);
    setErrorDetails(null);
    
    try {
      await signIn(loginEmail, loginPassword);
      
      // Get the redirect path from location state or default to home
      const from = location.state?.from?.pathname || "/";
      navigate(from);
    } catch (error: any) {
      console.error("Login error:", error);
      setErrorDetails(error.message);
      toast.error("Falha ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  const handleDirectAdminLogin = () => {
    if (isEditor || isFreeAccessEnabled) {
      console.log(`Redirecionando para área administrativa (${environmentInfo})`);
      navigate("/admin");
    } else {
      console.log("Direct admin login requires master admin access");
      navigate("/auth");
    }
  };

  return {
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    loading,
    errorDetails,
    handleLogin,
    handleDirectAdminLogin,
    isEditor,
    isFreeAccessEnabled,
    environmentInfo
  };
};
