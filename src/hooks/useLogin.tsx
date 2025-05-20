
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { shouldBypassAuth } from "@/utils/lovableEditorDetection";

export const useLogin = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  
  // Verificar se devemos permitir acesso sem autenticação
  const bypassAuth = shouldBypassAuth();
    
  // Automatically redirect to dashboard if special access is granted
  useEffect(() => {
    if (bypassAuth) {
      console.log("Acesso total concedido - redirecionando para dashboard");
      toast.info("Acesso especial concedido", {
        description: "Você tem acesso total ao sistema sem necessidade de autenticação"
      });
      navigate("/");
    }
  }, [bypassAuth, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (bypassAuth) {
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
    if (bypassAuth) {
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
    bypassAuth
  };
};
