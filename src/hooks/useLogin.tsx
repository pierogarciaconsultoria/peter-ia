
import { useState } from "react";

export const useLogin = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  // Placeholder functions that don't perform authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login functionality disabled");
  };

  const handleDirectAdminLogin = () => {
    console.log("Admin login functionality disabled");
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
