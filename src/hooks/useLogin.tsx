
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const navigate = useNavigate();

  // Placeholder function that redirects to the home page
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login desativado, redirecionando para home");
    navigate("/");
  };

  const handleDirectAdminLogin = () => {
    console.log("Admin login desativado, redirecionando para home");
    navigate("/");
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
