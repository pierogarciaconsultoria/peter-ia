import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { shouldBypassAuth } from "@/utils/lovableEditorDetection";
import { toast } from "sonner";

export const useLogin = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signIn } = useAuth();
  
  // Check if we should bypass auth
  const bypassAuth = shouldBypassAuth();

  useEffect(() => {
    // Clear any errors when the email or password changes
    setErrorDetails(null);
  }, [loginEmail, loginPassword]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorDetails(null);

    try {
      if (!signIn) {
        throw new Error("signIn function is not available");
      }
      
      await signIn(loginEmail, loginPassword);
      toast.success("Login realizado com sucesso");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login failed:", error);
      setErrorDetails(error.message || "Falha ao fazer login");
      toast.error(error.message || "Falha ao fazer login");
    } finally {
      setLoading(false);
    }
  };
  
  // Function to directly log in as admin
  const handleDirectAdminLogin = async () => {
    setLoading(true);
    setErrorDetails(null);
    
    try {
      setLoginEmail("contato@pierogarcia.com.br");
      setLoginPassword("pi391500B@");
      
      if (!signIn) {
        throw new Error("signIn function is not available");
      }
      
      await signIn("contato@pierogarcia.com.br", "pi391500B@");
      toast.success("Login administrativo realizado com sucesso");
      navigate("/admin");
    } catch (error: any) {
      console.error("Admin login failed:", error);
      setErrorDetails(error.message || "Falha ao fazer login administrativo");
      toast.error(error.message || "Falha ao fazer login administrativo");
    } finally {
      setLoading(false);
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
