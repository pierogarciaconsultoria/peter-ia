
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
  isLoading: boolean; // Alias para compatibilidade
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  reconnect: () => void;
  isSuperAdmin: boolean;
  isCompanyAdmin: boolean;
  isAdmin: boolean;
  empresaId?: string; // Para compatibilidade com código legado
}

// Export the context so it can be imported
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userCompany, setUserCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');

  // Debug logs
  console.log('🔄 AuthProvider: Renderizando componente');
  console.log('🔄 AuthProvider: Estado atual:', {
    user: user ? 'presente' : 'null',
    userProfile: userProfile ? 'presente' : 'null',
    userCompany: userCompany ? 'presente' : 'null',
    loading,
    connectionStatus
  });

  // Detecta se é super admin no Lovable Editor
  const isLovableEditor = isSuperAdminInLovable();
  console.log('🔍 AuthProvider: isLovableEditor =', isLovableEditor);

  const fetchUserProfile = async (userId: string) => {
    console.log('📥 AuthProvider: Buscando perfil do usuário:', userId);
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ AuthProvider: Erro ao buscar perfil do usuário:', error);
        return null;
      }

      console.log('✅ AuthProvider: Perfil do usuário encontrado:', profile ? 'sim' : 'não');
      return profile;
    } catch (error) {
      console.error('❌ AuthProvider: Erro inesperado ao buscar perfil:', error);
      return null;
    }
  };

  const fetchUserCompany = async (companyId: string) => {
    console.log('🏢 AuthProvider: Buscando empresa:', companyId);
    try {
      const { data: company, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ AuthProvider: Erro ao buscar empresa:', error);
        return null;
      }

      console.log('✅ AuthProvider: Empresa encontrada:', company ? 'sim' : 'não');
      return company;
    } catch (error) {
      console.error('❌ AuthProvider: Erro inesperado ao buscar empresa:', error);
      return null;
    }
  };

  const initializeUser = async (user: User | null) => {
    console.log('🚀 AuthProvider: Inicializando usuário:', user ? user.email : 'null');
    
    if (!user) {
      console.log('👤 AuthProvider: Usuário null, limpando estado');
      setUserProfile(null);
      setUserCompany(null);
      setLoading(false);
      return;
    }

    try {
      console.log('📊 AuthProvider: Buscando dados do usuário...');
      
      // Buscar perfil do usuário
      const profile = await fetchUserProfile(user.id);
      console.log('📊 AuthProvider: Perfil obtido:', profile ? 'sucesso' : 'falhou');
      setUserProfile(profile);

      // Se o perfil tem uma empresa, buscar os dados da empresa
      if (profile?.company_id) {
        console.log('🏢 AuthProvider: Buscando dados da empresa:', profile.company_id);
        const company = await fetchUserCompany(profile.company_id);
        console.log('🏢 AuthProvider: Empresa obtida:', company ? 'sucesso' : 'falhou');
        setUserCompany(company);
      } else {
        console.log('🏢 AuthProvider: Usuário sem empresa');
        setUserCompany(null);
      }

      console.log('✅ AuthProvider: Inicialização concluída com sucesso');
      setConnectionStatus('connected');
    } catch (error) {
      console.error('❌ AuthProvider: Erro ao inicializar usuário:', error);
      setConnectionStatus('disconnected');
    } finally {
      console.log('🏁 AuthProvider: Finalizando inicialização, setLoading(false)');
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔧 AuthProvider: useEffect iniciado');
    
    // Verificar sessão atual
    const checkSession = async () => {
      console.log('🔍 AuthProvider: Verificando sessão atual...');
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ AuthProvider: Erro ao verificar sessão:', error);
          setConnectionStatus('disconnected');
        } else {
          console.log('📋 AuthProvider: Sessão encontrada:', session ? 'sim' : 'não');
          setUser(session?.user || null);
          await initializeUser(session?.user || null);
        }
      } catch (error) {
        console.error('❌ AuthProvider: Erro inesperado ao verificar sessão:', error);
        setConnectionStatus('disconnected');
        setLoading(false);
      }
    };

    checkSession();

    // Escutar mudanças de autenticação
    console.log('👂 AuthProvider: Configurando listener de auth state');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 AuthProvider: Auth state changed:', event, session?.user?.email || 'no user');
      
      setUser(session?.user || null);
      
      // Usar setTimeout para evitar problemas de recursão
      setTimeout(async () => {
        await initializeUser(session?.user || null);
      }, 0);
    });

    return () => {
      console.log('🧹 AuthProvider: Limpando subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('🔐 AuthProvider: Iniciando login para:', email);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ AuthProvider: Erro no login:', error);
        throw error;
      }

      console.log('✅ AuthProvider: Login realizado com sucesso');

      // Atualizar last_login se o perfil existir
      if (data.user) {
        console.log('📝 AuthProvider: Atualizando last_login');
        await supabase
          .from('user_profiles')
          .update({ last_login: new Date().toISOString() })
          .eq('id', data.user.id);
      }

      toast.success('Login realizado com sucesso');
    } catch (error: any) {
      console.error('❌ AuthProvider: Erro no login:', error);
      toast.error(error.message || 'Erro ao fazer login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    console.log('📝 AuthProvider: Iniciando cadastro para:', email);
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
        console.error('❌ AuthProvider: Erro no cadastro:', error);
        throw error;
      }

      console.log('✅ AuthProvider: Cadastro realizado com sucesso');
      toast.success('Conta criada com sucesso! Verifique seu email.');
    } catch (error: any) {
      console.error('❌ AuthProvider: Erro no cadastro:', error);
      toast.error(error.message || 'Erro ao criar conta');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    console.log('🚪 AuthProvider: Iniciando logout');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ AuthProvider: Erro no logout:', error);
        throw error;
      }
      
      console.log('✅ AuthProvider: Logout realizado com sucesso');
      setUser(null);
      setUserProfile(null);
      setUserCompany(null);
    } catch (error: any) {
      console.error('❌ AuthProvider: Erro no logout:', error);
      toast.error('Erro ao fazer logout');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const reconnect = () => {
    console.log('🔄 AuthProvider: Reconectando...');
    setConnectionStatus('connecting');
    window.location.reload();
  };

  // Calcular permissões com fallbacks seguros
  const isSuperAdmin = isLovableEditor || (userProfile?.is_super_admin ?? false);
  const isCompanyAdmin = isLovableEditor || (userProfile?.is_company_admin ?? false);
  const isAdmin = isSuperAdmin || isCompanyAdmin;

  console.log('🔑 AuthProvider: Permissões calculadas:', {
    isSuperAdmin,
    isCompanyAdmin,
    isAdmin,
    isLovableEditor
  });

  const value: AuthContextType = {
    user,
    userProfile,
    userCompany,
    loading,
    isLoading: loading, // Alias para compatibilidade
    connectionStatus,
    signOut,
    signIn,
    signUp,
    reconnect,
    isSuperAdmin,
    isCompanyAdmin,
    isAdmin,
    empresaId: userProfile?.company_id, // Para compatibilidade com código legado
  };

  console.log('📦 AuthProvider: Retornando provider com value:', {
    hasUser: !!value.user,
    hasProfile: !!value.userProfile,
    hasCompany: !!value.userCompany,
    loading: value.loading,
    connectionStatus: value.connectionStatus
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the useAuth hook directly from this file
export const useAuth = (): AuthContextType => {
  console.log('🪝 useAuth: Hook chamado');
  const context = useContext(AuthContext);
  if (!context) {
    console.error('❌ useAuth: Context não encontrado! useAuth deve ser usado dentro de AuthProvider');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  console.log('✅ useAuth: Context encontrado');
  return context;
};
