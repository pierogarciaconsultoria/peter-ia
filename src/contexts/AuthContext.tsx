import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { isSuperAdminInLovable } from '@/utils/lovableEditorDetection';
import { logger } from '@/utils/logger';
import { authOptimization } from '@/utils/authOptimization';

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
  hasAuthError: boolean;
  clearAuthError: () => void;
}

// Create and export the context
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userCompany, setUserCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
  const [hasAuthError, setHasAuthError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Debug logging for context creation
  logger.debug('AuthContext', 'AuthProvider inicializado');
  
  // Detecta se é super admin no Lovable Editor
  const isLovableEditor = isSuperAdminInLovable();
  logger.debug('AuthContext', 'Super admin detection', { isLovableEditor });

  const clearAuthError = () => {
    logger.debug('AuthProvider', 'Limpando erro de autenticação');
    setHasAuthError(false);
    setRetryCount(0);
  };

  const handleError = (error: any, context: string) => {
    logger.error('AuthProvider', `Erro em ${context}`, { 
      errorCode: error?.code,
      errorMessage: error?.message,
      context 
    });
    setHasAuthError(true);
    
    // Se for erro de permissão, não mostrar toast repetidamente
    if (error?.code !== 'PGRST301' && error?.message !== 'JWT expired') {
      toast.error(`Erro de autenticação: ${error.message || 'Erro desconhecido'}`);
    }
    
    // Auto-recovery para certos tipos de erro
    if (error?.message?.includes('JWT expired') || error?.code === 'PGRST301') {
      logger.info('AuthProvider', 'Tentando recuperação automática');
      setTimeout(() => {
        if (retryCount < 3) {
          setRetryCount(prev => prev + 1);
          reconnect();
        }
      }, 2000);
    }
  };

  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    logger.debug('AuthProvider', 'Buscando perfil do usuário', { userId: userId.substring(0, 8) + '...' });
    try {
      // Usar otimização de cache para buscar perfil
      const profile = await authOptimization.getUserProfileOptimized(userId);
      
      if (!profile) {
        logger.info('AuthProvider', 'Perfil não encontrado para usuário');
        return null;
      }

      logger.debug('AuthProvider', 'Perfil do usuário encontrado');
      return profile;
    } catch (error) {
      handleError(error, 'fetchUserProfile');
      return null;
    }
  };

  const fetchUserCompany = async (companyId: string): Promise<Company | null> => {
    logger.debug('AuthProvider', 'Buscando empresa', { companyId });
    try {
      const { data: company, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          logger.info('AuthProvider', 'Empresa não encontrada');
          return null;
        }
        handleError(error, 'fetchUserCompany');
        return null;
      }

      logger.debug('AuthProvider', 'Empresa encontrada');
      return company;
    } catch (error) {
      handleError(error, 'fetchUserCompany');
      return null;
    }
  };

  const initializeUser = async (user: User | null) => {
    logger.debug('AuthProvider', 'Inicializando usuário', { 
      hasUser: !!user,
      userId: user?.id?.substring(0, 8) + '...' || 'none'
    });
    
    if (!user) {
      logger.debug('AuthProvider', 'Usuário null, limpando estado');
      setUserProfile(null);
      setUserCompany(null);
      setLoading(false);
      setConnectionStatus('connected');
      clearAuthError();
      return;
    }

    try {
      logger.debug('AuthProvider', 'Buscando dados do usuário');
      
      // Buscar perfil do usuário com otimização
      const profile = await fetchUserProfile(user.id);
      setUserProfile(profile);

      // Se o perfil tem uma empresa, buscar os dados da empresa
      if (profile?.company_id) {
        logger.debug('AuthProvider', 'Buscando dados da empresa');
        const company = await fetchUserCompany(profile.company_id);
        setUserCompany(company);
      } else {
        logger.debug('AuthProvider', 'Usuário sem empresa');
        setUserCompany(null);
      }

      logger.debug('AuthProvider', 'Inicialização concluída com sucesso');
      setConnectionStatus('connected');
      clearAuthError();
    } catch (error) {
      logger.error('AuthProvider', 'Erro ao inicializar usuário', error);
      handleError(error, 'initializeUser');
      setConnectionStatus('disconnected');
    } finally {
      logger.debug('AuthProvider', 'Finalizando inicialização');
      setLoading(false);
    }
  };

  useEffect(() => {
    logger.debug('AuthProvider', 'useEffect iniciado');
    
    // Verificar sessão atual
    const checkSession = async () => {
      logger.debug('AuthProvider', 'Verificando sessão atual');
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          logger.error('AuthProvider', 'Erro ao verificar sessão', error);
          handleError(error, 'checkSession');
          setConnectionStatus('disconnected');
        } else {
          logger.debug('AuthProvider', 'Sessão verificada', { hasSession: !!session });
          setUser(session?.user || null);
          await initializeUser(session?.user || null);
        }
      } catch (error) {
        logger.error('AuthProvider', 'Erro inesperado ao verificar sessão', error);
        handleError(error, 'checkSession');
        setConnectionStatus('disconnected');
        setLoading(false);
      }
    };

    checkSession();

    // Escutar mudanças de autenticação
    logger.debug('AuthProvider', 'Configurando listener de auth state');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      logger.debug('AuthProvider', 'Auth state changed', { 
        event, 
        hasUser: !!session?.user 
      });
      
      setUser(session?.user || null);
      
      // Usar setTimeout para evitar problemas de recursão
      setTimeout(async () => {
        await initializeUser(session?.user || null);
      }, 0);
    });

    return () => {
      logger.debug('AuthProvider', 'Limpando subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    logger.debug('AuthProvider', 'Iniciando login');
    setLoading(true);
    clearAuthError();
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        logger.error('AuthProvider', 'Erro no login', error);
        handleError(error, 'signIn');
        throw error;
      }

      logger.info('AuthProvider', 'Login realizado com sucesso');

      // Atualizar last_login se o perfil existir
      if (data.user) {
        logger.debug('AuthProvider', 'Atualizando last_login');
        try {
          await supabase
            .from('user_profiles')
            .update({ last_login: new Date().toISOString() })
            .eq('id', data.user.id);
        } catch (updateError) {
          logger.warn('AuthProvider', 'Erro ao atualizar last_login', updateError);
          // Não falhar o login por causa disso
        }
      }

      toast.success('Login realizado com sucesso');
    } catch (error: any) {
      logger.error('AuthProvider', 'Erro no login', error);
      handleError(error, 'signIn');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    logger.debug('AuthProvider', 'Iniciando cadastro');
    setLoading(true);
    clearAuthError();
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) {
        logger.error('AuthProvider', 'Erro no cadastro', error);
        handleError(error, 'signUp');
        throw error;
      }

      logger.info('AuthProvider', 'Cadastro realizado com sucesso');
      toast.success('Conta criada com sucesso! Verifique seu email.');
    } catch (error: any) {
      logger.error('AuthProvider', 'Erro no cadastro', error);
      handleError(error, 'signUp');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    logger.debug('AuthProvider', 'Iniciando logout');
    setLoading(true);
    clearAuthError();
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        logger.error('AuthProvider', 'Erro no logout', error);
        handleError(error, 'signOut');
        throw error;
      }
      
      logger.info('AuthProvider', 'Logout realizado com sucesso');
      setUser(null);
      setUserProfile(null);
      setUserCompany(null);
      toast.success('Logout realizado com sucesso');
    } catch (error: any) {
      logger.error('AuthProvider', 'Erro no logout', error);
      handleError(error, 'signOut');
      // Mesmo com erro, limpar estado local
      setUser(null);
      setUserProfile(null);
      setUserCompany(null);
    } finally {
      setLoading(false);
    }
  };

  const reconnect = () => {
    logger.debug('AuthProvider', 'Reconectando');
    setConnectionStatus('connecting');
    clearAuthError();
    
    // Tentar recarregar a sessão
    setTimeout(async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!error && session) {
          setUser(session.user);
          await initializeUser(session.user);
        } else {
          setConnectionStatus('disconnected');
        }
      } catch (error) {
        logger.error('AuthProvider', 'Erro na reconexão', error);
        setConnectionStatus('disconnected');
      }
    }, 1000);
  };

  // Calcular permissões com fallbacks seguros
  const isSuperAdmin = isLovableEditor || (userProfile?.is_super_admin ?? false);
  const isCompanyAdmin = isLovableEditor || (userProfile?.is_company_admin ?? false);
  const isAdmin = isSuperAdmin || isCompanyAdmin;

  logger.debug('AuthProvider', 'Permissões calculadas', {
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
    hasAuthError,
    clearAuthError,
  };

  logger.debug('AuthContext', 'Providing context value', { 
    hasUser: !!user, 
    hasProfile: !!userProfile,
    loading 
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the useAuth hook directly from this file
export const useAuth = (): AuthContextType => {
  logger.debug('useAuth', 'Hook called');
  const context = useContext(AuthContext);
  if (!context) {
    logger.error('useAuth', 'Context not found! useAuth must be used within AuthProvider');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  logger.debug('useAuth', 'Context found successfully');
  return context;
};
