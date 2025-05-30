import { useState, useEffect, useCallback } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { isSuperAdminInLovable } from "@/utils/lovableEditorDetection";

export interface ModuloPermissao {
  id: string;
  nome: string;
  chave: string;
  descricao?: string;
  pode_visualizar: boolean;
  pode_editar: boolean;
  pode_excluir: boolean;
  pode_criar: boolean;
}

export function useUserPermissions() {
  const { user, isMaster, isAdmin, empresaId } = useCurrentUser();
  const [permissoes, setPermissoes] = useState<ModuloPermissao[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Verificar se é super admin no Lovable Editor
  const isLovableMaster = isSuperAdminInLovable();

  // Função para buscar permissões do usuário otimizada
  const fetchPermissoes = useCallback(async () => {
    // Se for super admin no Lovable, não precisa buscar permissões
    if (isLovableMaster) {
      try {
        setLoading(true);
        
        const { data: modulos, error: modulosError } = await supabase
          .from('modulos')
          .select('*')
          .eq('ativo', true);
          
        if (modulosError) throw modulosError;
        
        // Conceder todas as permissões para o usuário no modo Lovable Editor
        const permissoesCompletas = (modulos || []).map(modulo => ({
          id: modulo.id,
          nome: modulo.nome,
          chave: modulo.chave,
          descricao: modulo.descricao,
          pode_visualizar: true,
          pode_editar: true,
          pode_excluir: true,
          pode_criar: true
        }));
        
        setPermissoes(permissoesCompletas);
        setLoading(false);
        return;
      } catch (err) {
        console.error("Erro ao buscar módulos:", err);
        setLoading(false);
        return;
      }
    }

    if (!user?.id) {
      setPermissoes([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Para master e admin, buscamos todos os módulos com cache
      if (isMaster || isAdmin) {
        const { data: modulos, error: modulosError } = await supabase
          .from('modulos')
          .select('*')
          .eq('ativo', true);
          
        if (modulosError) throw modulosError;
        
        // Conceder todas as permissões para master e admin
        const permissoesCompletas = (modulos || []).map(modulo => ({
          id: modulo.id,
          nome: modulo.nome,
          chave: modulo.chave,
          descricao: modulo.descricao,
          pode_visualizar: true,
          pode_editar: true,
          pode_excluir: true,
          pode_criar: true
        }));
        
        setPermissoes(permissoesCompletas);
      } else {
        // Para usuários normais, buscamos as permissões específicas com otimização
        const { data, error } = await supabase
          .from('permissoes_usuario')
          .select(`
            modulo_id,
            pode_visualizar,
            pode_editar,
            pode_excluir,
            pode_criar,
            modulos:modulo_id (
              id, 
              nome, 
              chave, 
              descricao
            )
          `)
          .eq('usuario_id', user.id);
          
        if (error) throw error;
        
        // Formatar os dados para o formato esperado
        const permissoesUsuario = (data || []).map(item => ({
          id: item.modulos.id,
          nome: item.modulos.nome,
          chave: item.modulos.chave,
          descricao: item.modulos.descricao,
          pode_visualizar: item.pode_visualizar,
          pode_editar: item.pode_editar,
          pode_excluir: item.pode_excluir,
          pode_criar: item.pode_criar,
        }));
        
        setPermissoes(permissoesUsuario);
      }
    } catch (err: any) {
      console.error("Erro ao buscar permissões:", err);
      setError(err);
      // Não mostrar toast para erros de RLS já que foram corrigidos
      if (!err.message?.includes('infinite recursion')) {
        toast.error("Falha ao carregar permissões do usuário");
      }
    } finally {
      setLoading(false);
    }
  }, [user?.id, isMaster, isAdmin, isLovableMaster]);

  useEffect(() => {
    fetchPermissoes();
  }, [fetchPermissoes]);

  // Verificação de permissões simplificada com memoização
  const temPermissao = useCallback((modulo: string, tipo: 'visualizar' | 'editar' | 'excluir' | 'criar'): boolean => {
    // Super Admin no Lovable Editor tem todas as permissões
    if (isLovableMaster) return true;
    
    // Master tem todas as permissões automaticamente
    if (isMaster) return true;
    
    // Admin tem todas as permissões para sua empresa
    if (isAdmin) return true;
    
    // Procura pela permissão específica
    const permissao = permissoes.find(p => p.chave === modulo);
    if (!permissao) return false;
    
    switch (tipo) {
      case 'visualizar': return permissao.pode_visualizar;
      case 'editar': return permissao.pode_editar;
      case 'excluir': return permissao.pode_excluir;
      case 'criar': return permissao.pode_criar;
      default: return false;
    }
  }, [isMaster, isAdmin, permissoes, isLovableMaster]);

  // Funções auxiliares para simplificar o uso
  const podeVisualizar = useCallback((modulo: string): boolean => {
    return temPermissao(modulo, 'visualizar');
  }, [temPermissao]);

  const podeEditar = useCallback((modulo: string): boolean => {
    return temPermissao(modulo, 'editar');
  }, [temPermissao]);

  const podeExcluir = useCallback((modulo: string): boolean => {
    return temPermissao(modulo, 'excluir');
  }, [temPermissao]);

  const podeCriar = useCallback((modulo: string): boolean => {
    return temPermissao(modulo, 'criar');
  }, [temPermissao]);

  // Função para atribuir permissão a um usuário
  const atribuirPermissao = async (
    usuarioId: string, 
    moduloId: string, 
    permissoes: {
      visualizar?: boolean;
      editar?: boolean;
      excluir?: boolean;
      criar?: boolean;
    }
  ) => {
    // No modo Lovable Editor, super admins podem atribuir permissões
    if (!isMaster && !isAdmin && !isLovableMaster) {
      toast.error("Você não tem permissão para atribuir permissões");
      return { success: false, error: new Error("Sem permissão") };
    }

    try {
      // Verificar se já existe uma permissão para este usuário/módulo
      const { data: existente } = await supabase
        .from('permissoes_usuario')
        .select('id')
        .eq('usuario_id', usuarioId)
        .eq('modulo_id', moduloId)
        .maybeSingle();

      if (existente) {
        // Atualizar permissão existente
        const { error } = await supabase
          .from('permissoes_usuario')
          .update({
            pode_visualizar: permissoes.visualizar !== undefined ? permissoes.visualizar : true,
            pode_editar: permissoes.editar !== undefined ? permissoes.editar : false,
            pode_excluir: permissoes.excluir !== undefined ? permissoes.excluir : false,
            pode_criar: permissoes.criar !== undefined ? permissoes.criar : false,
          })
          .eq('id', existente.id);
          
        if (error) throw error;
      } else {
        // Criar nova permissão
        const { error } = await supabase
          .from('permissoes_usuario')
          .insert({
            usuario_id: usuarioId,
            modulo_id: moduloId,
            pode_visualizar: permissoes.visualizar !== undefined ? permissoes.visualizar : true,
            pode_editar: permissoes.editar !== undefined ? permissoes.editar : false,
            pode_excluir: permissoes.excluir !== undefined ? permissoes.excluir : false,
            pode_criar: permissoes.criar !== undefined ? permissoes.criar : false,
          });
          
        if (error) throw error;
      }
      
      toast.success("Permissão atualizada com sucesso");
      fetchPermissoes(); // Atualizar permissões após alteração
      return { success: true };
    } catch (err: any) {
      console.error("Erro ao atribuir permissão:", err);
      toast.error(`Falha ao atribuir permissão: ${err.message}`);
      return { success: false, error: err };
    }
  };

  // Função para remover permissão de um usuário
  const removerPermissao = async (usuarioId: string, moduloId: string) => {
    // No modo Lovable Editor, super admins podem remover permissões
    if (!isMaster && !isAdmin && !isLovableMaster) {
      toast.error("Você não tem permissão para remover permissões");
      return { success: false, error: new Error("Sem permissão") };
    }

    try {
      const { error } = await supabase
        .from('permissoes_usuario')
        .delete()
        .eq('usuario_id', usuarioId)
        .eq('modulo_id', moduloId);
        
      if (error) throw error;
      
      toast.success("Permissão removida com sucesso");
      fetchPermissoes(); // Atualizar permissões após alteração
      return { success: true };
    } catch (err: any) {
      console.error("Erro ao remover permissão:", err);
      toast.error(`Falha ao remover permissão: ${err.message}`);
      return { success: false, error: err };
    }
  };

  return {
    permissoes,
    isLoading: loading,
    error,
    temPermissao,
    podeVisualizar,
    podeEditar,
    podeExcluir,
    podeCriar,
    atribuirPermissao,
    removerPermissao,
    recarregarPermissoes: fetchPermissoes
  };
}
