
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { isSuperAdminInLovable } from "@/utils/lovableEditorDetection";

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  empresa_id?: string | null;
  is_master?: boolean;
  is_admin?: boolean;
  created_at?: string;
  updated_at?: string;
}

export function useCurrentUser() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  // Check if user is super admin in Lovable Editor
  const isMasterLovable = isSuperAdminInLovable();

  useEffect(() => {
    async function fetchUserProfile() {
      // If the user is a super admin in Lovable Editor, we can skip the database fetch
      if (isMasterLovable) {
        const mockSuperAdmin: UserProfile = {
          id: 'lovable-super-admin',
          nome: 'Super Admin (Lovable)',
          email: 'admin@lovable.dev',
          is_master: true,
          is_admin: true
        };
        setCurrentUser(mockSuperAdmin);
        setLoading(false);
        return;
      }

      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Buscar o perfil do usuário da tabela 'usuarios'
        // Usamos o método genérico .from() para evitar problemas de tipagem
        const { data, error } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("Erro ao buscar perfil do usuário:", error);
          setError(error);
          
          // Se não conseguirmos buscar o perfil, verificamos se é um erro de RLS
          if (error.message.includes('policy') || error.message.includes('recursion')) {
            console.warn("Possível problema com políticas RLS. Criando perfil temporário.");
            
            // Criar um perfil temporário baseado nos dados de autenticação
            const tempProfile: UserProfile = {
              id: user.id,
              nome: user.user_metadata?.nome || user.user_metadata?.name || 'Usuário',
              email: user.email || '',
              is_admin: user.user_metadata?.is_admin || false
            };
            
            setCurrentUser(tempProfile);
          } else {
            throw error;
          }
        } else {
          // Garantimos que o tipo do data corresponda ao UserProfile
          const userProfile: UserProfile = {
            id: data.id,
            nome: data.nome,
            email: data.email,
            empresa_id: data.empresa_id,
            is_master: data.is_master,
            is_admin: data.is_admin,
            created_at: data.created_at,
            updated_at: data.updated_at
          };
          
          setCurrentUser(userProfile);
          console.log("Perfil do usuário carregado:", userProfile);
        }
      } catch (err: any) {
        console.error("Erro inesperado:", err);
        setError(err);
        toast.error("Falha ao carregar dados do usuário");
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, [user?.id, isMasterLovable]);

  // Função para atualizar o perfil do usuário
  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user?.id) {
      toast.error("Usuário não autenticado");
      return { success: false };
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('usuarios')
        .update(updates)
        .eq('id', user.id)
        .select();
      
      if (error) {
        toast.error(`Erro ao atualizar perfil: ${error.message}`);
        return { success: false, error };
      }
      
      if (data && data.length > 0) {
        // Garantimos que o tipo do data[0] corresponda ao UserProfile
        const updatedUser: UserProfile = {
          id: data[0].id,
          nome: data[0].nome,
          email: data[0].email,
          empresa_id: data[0].empresa_id,
          is_master: data[0].is_master,
          is_admin: data[0].is_admin,
          created_at: data[0].created_at,
          updated_at: data[0].updated_at
        };
        
        setCurrentUser(updatedUser);
        toast.success("Perfil atualizado com sucesso");
        return { success: true, data: updatedUser };
      }
      
      return { success: true, data: null };
    } catch (err: any) {
      toast.error(`Falha ao atualizar perfil: ${err.message}`);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  return {
    user: currentUser,
    isLoading: loading,
    error,
    updateUserProfile,
    isMaster: currentUser?.is_master || isMasterLovable || false,
    isAdmin: currentUser?.is_admin || isMasterLovable || false,
    // Expor explicitamente o empresa_id para facilitar o uso em filtros
    empresaId: currentUser?.empresa_id || null,
  };
}
