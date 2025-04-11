
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
      // Usamos `as any` para evitar problemas de tipagem com tabelas dinâmicas
      const query = supabase.from('departamentos' as any);
      
      // Seleção de todos os campos
      const selectQuery = query.select('*');
      
      // Aplicamos o filtro de empresa
      const filteredQuery = applyFilter(selectQuery);
      
      const { data, error } = await filteredQuery;
      
      if (error) {
        throw error;
      }
      
      // Usando tipagem explícita para garantir que os dados correspondam ao tipo Departamento
      setDepartamentos((data || []) as Departamento[]);
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
