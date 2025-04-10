
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
  const [lgpdConsent, setLgpdConsent] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorDetails(null);
    
    try {
      console.log("Starting registration process...");
      
      // Step 1: Create a company if provided
      let companyId = null;
      if (companyName.trim()) {
        console.log("Creating company:", companyName);
        const companySlug = companyName.toLowerCase().replace(/\s+/g, '-');
        
        // Modificação: Simplificar a criação de empresa e melhorar o tratamento de erros
        const { data, error } = await supabase
          .from("companies")
          .insert({
            name: companyName,
            slug: companySlug,
            active: true
          })
          .select();
          
        if (error) {
          console.error("Company creation error:", error);
          throw new Error(`Erro ao criar empresa: ${error.message}`);
        }
        
        if (!data || data.length === 0) {
          console.error("No company data returned after successful creation");
          throw new Error("Empresa foi criada mas nenhum dado foi retornado");
        }
        
        companyId = data[0].id;
        console.log("Company created with ID:", companyId);
      }
      
      // Step 2: Register the user with appropriate metadata
      console.log("Registering user:", registerEmail);
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            company_id: companyId,
            is_company_admin: companyId ? true : false,
            lgpd_consent: lgpdConsent,
            lgpd_consent_date: new Date().toISOString()
          },
        },
      });
      
      if (authError) {
        console.error("Registration error:", authError);
        setErrorDetails(`Erro: ${authError.message}`);
        throw authError;
      }
      
      console.log("Registration successful:", authData);
      
      // No need to update user_profiles separately as this will be handled by the trigger
      // that creates the user_profiles entry based on the auth.users metadata
      
      toast.success("Cadastro realizado com sucesso! Verifique seu email.");
      setActiveTab("login");
    } catch (error: any) {
      console.error("Full registration error:", error);
      setErrorDetails(error.message || "Falha ao criar conta");
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
    lgpdConsent,
    setLgpdConsent,
    loading,
    errorDetails,
    handleRegister
  };
};
