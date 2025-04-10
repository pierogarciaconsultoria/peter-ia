
import { useCurrentUser } from "@/hooks/useCurrentUser";

// Função para aplicar o filtro de empresa a qualquer consulta do Supabase
export function applyEmpresaFilter(
  query: any, 
  empresaId: string | null, 
  isMaster: boolean
): any {
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
    applyFilter: (query: any) => 
      applyEmpresaFilter(query, empresaId, isMaster),
    empresaId,
    isMaster
  };
}
