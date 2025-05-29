
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { isSuperAdminInLovable } from '@/utils/lovableEditorDetection';

interface Company {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  active_modules: string[];
  active: boolean;
}

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company_id: string;
  is_super_admin: boolean;
  is_company_admin: boolean;
  created_at: string;
  last_login: string;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  userCompany: Company | null;
  loading: boolean;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  reconnect: () => void;
  isSuperAdmin: boolean;
  isCompanyAdmin: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userCompany, setUserCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');

  // Detecta se é super admin no Lovable Editor
  const isLovableEditor = isSuperAdminInLovable();

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar perfil do usuário:', error);
        return null;
      }

      return profile;
    } catch (error) {
      console.error('Erro inesperado ao buscar perfil:', error);
      return null;
    }
  };

  const fetchUserCompany = async (companyId: string) => {
    try {
      const { data: company, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar empresa:', error);
        return null;
      }

      return company;
    } catch (error) {
      console.error('Erro inesperado ao buscar empresa:', error);
      return null;
    }
  };

  const initializeUser = async (user: User | null) => {
    if (!user) {
      setUserProfile(null);
      setUserCompany(null);
      setLoading(false);
      return;
    }

    try {
      // Buscar perfil do usuário
      const profile = await fetchUserProfile(user.id);
      setUserProfile(profile);

      // Se o perfil tem uma empresa, buscar os dados da empresa
      if (profile?.company_id) {
        const company = await fetchUserCompany(profile.company_id);
        setUserCompany(company);
      }

      setConnectionStatus('connected');
    } catch (error) {
      console.error('Erro ao inicializar usuário:', error);
      setConnectionStatus('disconnected');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Verificar sessão atual
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro ao verificar sessão:', error);
          setConnectionStatus('disconnected');
        } else {
          setUser(session?.user || null);
          await initializeUser(session?.user || null);
        }
      } catch (error) {
        console.error('Erro inesperado ao verificar sessão:', error);
        setConnectionStatus('disconnected');
        setLoading(false);
      }
    };

    checkSession();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      setUser(session?.user || null);
      await initializeUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Atualizar last_login se o perfil existir
      if (data.user) {
        await supabase
          .from('user_profiles')
          .update({ last_login: new Date().toISOString() })
          .eq('id', data.user.id);
      }

      toast.success('Login realizado com sucesso');
    } catch (error: any) {
      console.error('Erro no login:', error);
      toast.error(error.message || 'Erro ao fazer login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) {
        throw error;
      }

      toast.success('Conta criada com sucesso! Verifique seu email.');
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      toast.error(error.message || 'Erro ao criar conta');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      
      setUser(null);
      setUserProfile(null);
      setUserCompany(null);
    } catch (error: any) {
      console.error('Erro no logout:', error);
      toast.error('Erro ao fazer logout');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const reconnect = () => {
    setConnectionStatus('connecting');
    window.location.reload();
  };

  // Calcular permissões
  const isSuperAdmin = isLovableEditor || (userProfile?.is_super_admin ?? false);
  const isCompanyAdmin = isLovableEditor || (userProfile?.is_company_admin ?? false);
  const isAdmin = isSuperAdmin || isCompanyAdmin;

  const value: AuthContextType = {
    user,
    userProfile,
    userCompany,
    loading,
    connectionStatus,
    signOut,
    signIn,
    signUp,
    reconnect,
    isSuperAdmin,
    isCompanyAdmin,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
