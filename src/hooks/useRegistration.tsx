
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { shouldGrantFreeAccess } from "@/utils/lovableEditorDetection";

export const useRegistration = (setActiveTab: (tab: string) => void) => {
  const [loading, setLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  
  // Company fields
  const [companyName, setCompanyName] = useState("");
  const [companyCnpj, setCompanyCnpj] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyResponsible, setCompanyResponsible] = useState("");
  
  const [lgpdConsent, setLgpdConsent] = useState(false);

  // Verifica se é modo de acesso gratuito
  const isFreeAccess = shouldGrantFreeAccess();

  // Auto-fill company responsible when name changes
  const handleFirstNameChange = (value: string) => {
    setFirstName(value);
    if (!companyResponsible && lastName) {
      setCompanyResponsible(`${value} ${lastName}`);
    } else if (!companyResponsible) {
      setCompanyResponsible(value);
    }
  };

  const handleLastNameChange = (value: string) => {
    setLastName(value);
    if (!companyResponsible && firstName) {
      setCompanyResponsible(`${firstName} ${value}`);
    }
  };

  // Format CNPJ
  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  // Format phone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Se o acesso livre está habilitado, concede acesso imediatamente
    if (isFreeAccess) {
      toast.success("Acesso concedido automaticamente no modo demonstração");
      setActiveTab("login");
      return;
    }
    
    setLoading(true);
    setErrorDetails(null);
    
    try {
      console.log("Starting registration process...");
      
      // Step 1: Create a company if provided
      let companyId = null;
      if (companyName.trim()) {
        console.log("Creating company:", companyName);
        const companySlug = companyName.toLowerCase().replace(/\s+/g, '-');
        
        const { data, error } = await supabase
          .from("companies")
          .insert({
            name: companyName,
            slug: companySlug,
            cnpj: companyCnpj || null,
            address: companyAddress || null,
            phone: companyPhone || null,
            email: companyEmail || null,
            responsible: companyResponsible || null,
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
    setFirstName: handleFirstNameChange,
    lastName,
    setLastName: handleLastNameChange,
    registerEmail,
    setRegisterEmail,
    registerPassword,
    setRegisterPassword,
    companyName,
    setCompanyName,
    companyCnpj,
    setCompanyCnpj: (value: string) => setCompanyCnpj(formatCNPJ(value)),
    companyAddress,
    setCompanyAddress,
    companyPhone,
    setCompanyPhone: (value: string) => setCompanyPhone(formatPhone(value)),
    companyEmail,
    setCompanyEmail,
    companyResponsible,
    setCompanyResponsible,
    lgpdConsent,
    setLgpdConsent,
    loading,
    errorDetails,
    handleRegister,
    isFreeAccess
  };
};
