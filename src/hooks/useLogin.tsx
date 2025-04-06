
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const useLogin = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  
  // Check for Lovable editor access
  const isLovableEditor = 
    window.location.search.includes('master_admin=true') || 
    (process.env.NODE_ENV === 'development' && window.self !== window.top);
    
  // Automatically redirect to dashboard if in Lovable editor
  useEffect(() => {
    if (isLovableEditor) {
      console.log("Lovable editor access detected, redirecting to dashboard");
      navigate("/");
    }
  }, [isLovableEditor, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLovableEditor) {
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
    if (isLovableEditor) {
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
    handleDirectAdminLogin
  };
};
