
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { PostgrestFilterBuilder } from "@supabase/supabase-js";

// Função para aplicar o filtro de empresa a qualquer consulta do Supabase
export function applyEmpresaFilter<T>(
  query: PostgrestFilterBuilder<any, any, T>, 
  empresaId: string | null, 
  isMaster: boolean
): PostgrestFilterBuilder<any, any, T> {
  // Se o usuário for master, não aplicamos o filtro (pode ver tudo)
  if (isMaster) {
    return query;
  }

  // Se tiver empresa_id, filtra por ela
  if (empresaId) {
    return query.eq('empresa_id', empresaId);
  }

  // Se não tiver empresa_id e não for master, não mostra nada (is_null não traz resultados)
  return query.is('id', null);
}

// Hook para facilitar o uso do filtro de empresa
export function useEmpresaFilter() {
  const { empresaId, isMaster } = useCurrentUser();
  
  return {
    applyFilter: <T>(query: PostgrestFilterBuilder<any, any, T>) => 
      applyEmpresaFilter(query, empresaId, isMaster),
    empresaId,
    isMaster
  };
}
