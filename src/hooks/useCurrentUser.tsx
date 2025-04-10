
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

  useEffect(() => {
    async function fetchUserProfile() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Buscar o perfil do usuário da tabela 'usuarios'
        const { data, error } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("Erro ao buscar perfil do usuário:", error);
          setError(error);
          throw error;
        }

        setCurrentUser(data);
        console.log("Perfil do usuário carregado:", data);
      } catch (err: any) {
        console.error("Erro inesperado:", err);
        setError(err);
        toast.error("Falha ao carregar dados do usuário");
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, [user?.id]);

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
        .select()
        .single();
      
      if (error) {
        toast.error(`Erro ao atualizar perfil: ${error.message}`);
        return { success: false, error };
      }
      
      setCurrentUser(data);
      toast.success("Perfil atualizado com sucesso");
      return { success: true, data };
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
    isMaster: currentUser?.is_master || false,
    isAdmin: currentUser?.is_admin || false,
  };
}
