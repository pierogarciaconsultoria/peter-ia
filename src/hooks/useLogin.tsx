
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { isLovableEditor, shouldGrantFreeAccess } from "@/utils/lovableEditorDetection";

// Flag para desabilitar temporariamente a autenticação
const BYPASS_AUTH_TEMPORARILY = true;

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
    
  // Automatically redirect to dashboard if in Lovable editor or free access mode
  // or if authentication is temporarily disabled
  useEffect(() => {
    if (isEditor || isFreeAccessEnabled || BYPASS_AUTH_TEMPORARILY) {
      console.log("Acesso total concedido - redirecionando para dashboard");
      if (BYPASS_AUTH_TEMPORARILY) {
        toast.info("Autenticação temporariamente desabilitada", {
          description: "Acesso concedido sem necessidade de email e senha"
        });
      }
      navigate("/");
    }
  }, [isEditor, isFreeAccessEnabled, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditor || isFreeAccessEnabled || BYPASS_AUTH_TEMPORARILY) {
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
    if (isEditor || isFreeAccessEnabled || BYPASS_AUTH_TEMPORARILY) {
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
    isFreeAccessEnabled
  };
};
