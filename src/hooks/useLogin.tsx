
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorDetails(null);
    
    try {
      console.log("Attempting login with:", { email: loginEmail });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      
      if (error) {
        console.error("Login error:", error);
        setErrorDetails(`Erro: ${error.message}`);
        throw error;
      }
      
      console.log("Login successful:", data);
      
      // Successful login
      toast.success("Login realizado com sucesso!");
      navigate("/");
    } catch (error: any) {
      console.error("Full error details:", error);
      toast.error(error.message || "Falha ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to send password reset for admin user
  const handleDirectAdminLogin = async () => {
    setLoading(true);
    setErrorDetails(null);
    
    try {
      const adminEmail = "contato@pierogarcia.com.br";
      
      // Send password reset email to admin
      const { error } = await supabase.auth.resetPasswordForEmail(adminEmail, {
        redirectTo: window.location.origin + "/auth"
      });
      
      if (error) {
        console.error("Admin login error:", error);
        setErrorDetails(`Erro ao enviar link para o administrador: ${error.message}`);
        
        throw error;
      }
      
      toast.success("Um link de acesso foi enviado para o email do administrador.");
    } catch (error: any) {
      console.error("Admin login failed:", error);
      toast.error(error.message || "Falha ao enviar link para o administrador");
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
    handleDirectAdminLogin
  };
};
