
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useEmpresaFilter } from "@/utils/empresaFilter";
import { toast } from "sonner";

export type Departamento = {
  id: string;
  nome: string;
  descricao?: string;
  empresa_id: string;
};

export function useDepartamentosFiltered() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { applyFilter, empresaId, isMaster } = useEmpresaFilter();

  const fetchDepartamentos = async () => {
    setIsLoading(true);
    
    try {
      // Criamos a query base - usando any para contornar as restrições de tipo
      let query = supabase.from('departamentos').select('*') as any;
      
      // Aplicamos o filtro de empresa
      query = applyFilter(query);
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      // Garantimos que o tipo dos dados corresponda a Departamento[]
      const typedData = data as unknown as Departamento[];
      setDepartamentos(typedData || []);
    } catch (error: any) {
      console.error("Erro ao buscar departamentos:", error);
      toast.error("Falha ao carregar departamentos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (empresaId || isMaster) {
      fetchDepartamentos();
    }
  }, [empresaId, isMaster]);

  return {
    departamentos,
    isLoading,
    refresh: fetchDepartamentos,
    // Exportar essas informações é útil caso o componente precise 
    // saber se o usuário é master ou qual a empresa dele
    isMaster,
    empresaId
  };
}
