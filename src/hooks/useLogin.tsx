
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

  // Helper function to directly login the admin user
  const handleDirectAdminLogin = async () => {
    setLoading(true);
    setErrorDetails(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "contato@pierogarcia.com.br",
        password: "pi391500B@",
      });
      
      if (error) {
        console.error("Admin login error:", error);
        setErrorDetails(`Erro de login do administrador: ${error.message}`);
        
        // If error is about email confirmation, let's inform the user
        if (error.message.includes("Email not confirmed")) {
          toast.error("O email do administrador precisa ser confirmado. Por favor, verifique o email contato@pierogarcia.com.br ou desative a confirmação de email no painel do Supabase.");
        }
        
        throw error;
      }
      
      console.log("Admin login successful:", data);
      toast.success("Login como administrador realizado com sucesso!");
      navigate("/");
    } catch (error: any) {
      console.error("Admin login failed:", error);
      toast.error(error.message || "Falha ao fazer login como administrador");
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
