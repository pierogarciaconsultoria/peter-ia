
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useRegistration = (setActiveTab: (tab: string) => void) => {
  const [loading, setLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [companyName, setCompanyName] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorDetails(null);
    
    try {
      // Step 1: Register the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });
      
      if (authError) {
        console.error("Registration error:", authError);
        setErrorDetails(`Erro: ${authError.message}`);
        throw authError;
      }
      
      console.log("Registration successful:", authData);
      
      // Step 2: Create a company if provided
      if (companyName.trim()) {
        const { data: companyData, error: companyError } = await supabase
          .from("companies")
          .insert({
            name: companyName,
            slug: companyName.toLowerCase().replace(/\s+/g, '-'),
          })
          .select("id")
          .single();
          
        if (companyError) throw companyError;
        
        // Step 3: Update the user profile with company and admin role
        const { error: profileError } = await supabase
          .from("user_profiles")
          .update({
            company_id: companyData.id,
            is_company_admin: true
          })
          .eq("id", authData.user?.id);
          
        if (profileError) throw profileError;
      }
      
      toast.success("Cadastro realizado com sucesso! Verifique seu email.");
      setActiveTab("login");
    } catch (error: any) {
      console.error("Full registration error:", error);
      toast.error(error.message || "Falha ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    registerEmail,
    setRegisterEmail,
    registerPassword,
    setRegisterPassword,
    companyName,
    setCompanyName,
    loading,
    errorDetails,
    handleRegister
  };
};
