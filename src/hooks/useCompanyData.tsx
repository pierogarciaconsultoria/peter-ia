
import { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface CompanyData {
  id: string;
  nome: string;
  cnpj: string;
}

export function useCompanyData() {
  const { empresaId } = useCurrentUser();
  const [loading, setLoading] = useState<boolean>(true);
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    async function fetchCompanyData() {
      if (!empresaId) {
        console.log("Usuário não tem empresa_id associado");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        console.log("Buscando dados da empresa para id:", empresaId);
        
        const { data, error } = await supabase.rpc('get_company_by_id', {
          company_uuid: empresaId
        });
        
        if (error) {
          console.error("Erro ao buscar dados da empresa:", error);
          setError(error);
          toast.error("Falha ao carregar dados da empresa");
        } else {
          console.log("Dados da empresa carregados:", data);
          // A função pode retornar um objeto único ou um array
          // Vamos tratar ambos os casos para garantir
          if (Array.isArray(data)) {
            if (data.length > 0) {
              setCompany(data[0] as CompanyData);
            } else {
              setCompany(null);
            }
          } else {
            // Caso seja um objeto único
            setCompany(data as CompanyData);
          }
        }
      } catch (err: any) {
        console.error("Erro inesperado:", err);
        setError(err);
        toast.error("Falha ao carregar dados da empresa");
      } finally {
        setLoading(false);
      }
    }

    fetchCompanyData();
  }, [empresaId]);

  return {
    company,
    loading,
    error,
    refetch: async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.rpc('get_company_by_id', {
          company_uuid: empresaId
        });
        
        if (error) throw error;
        
        if (Array.isArray(data)) {
          setCompany(data.length > 0 ? data[0] as CompanyData : null);
        } else {
          setCompany(data as CompanyData);
        }
        
        return { success: true, data };
      } catch (err: any) {
        setError(err);
        return { success: false, error: err };
      } finally {
        setLoading(false);
      }
    }
  };
}
