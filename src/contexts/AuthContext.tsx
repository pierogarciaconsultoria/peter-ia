import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { isSuperAdminInLovable, shouldBypassAuth, isProductionEnvironment } from '@/utils/lovableEditorDetection';
import { logger } from '@/utils/logger';
import { authOptimization } from '@/utils/authOptimization';

// SECURITY: Constantes de segurança
const SECURITY_CONSTANTS = {
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 horas
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 2000,
  ACTIVITY_CHECK_INTERVAL: 5 * 60 * 1000, // 5 minutos
};

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
  isLoading: boolean;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  reconnect: () => void;
  isSuperAdmin: boolean;
  isCompanyAdmin: boolean;
  isAdmin: boolean;
  empresaId?: string;
  hasAuthError: boolean;
  clearAuthError: () => void;
  // SECURITY: Novos campos de segurança
  sessionExpiry: Date | null;
  lastActivity: Date | null;
  forceLogout: () => void;
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
  
  // SECURITY: Novos estados de segurança
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null);
  const [lastActivity, setLastActivity] = useState<Date | null>(null);

  const isLovableEditor = isSuperAdminInLovable();
  const bypassAuth = shouldBypassAuth();

  // SECURITY: Validar sessão expirada
  const isSessionExpired = useCallback(() => {
    if (!sessionExpiry) return false;
    return new Date() > sessionExpiry;
  }, [sessionExpiry]);

  // SECURITY: Atualizar atividade do usuário
  const updateLastActivity = useCallback(() => {
    setLastActivity(new Date());
  }, []);

  // SECURITY: Forçar logout por segurança
  const forceLogout = useCallback(async () => {
    logger.warn('AuthProvider', 'Forçando logout por segurança');
    setUser(null);
    setUserProfile(null);
    setUserCompany(null);
    setSessionExpiry(null);
    setLastActivity(null);
    
    try {
      await supabase.auth.signOut();
    } catch (error) {
      logger.error('AuthProvider', 'Erro ao forçar logout', error);
    }
    
    toast.error('Sessão expirada. Faça login novamente.');
  }, []);

  // SECURITY: Verificar validade da sessão
  const validateSession = useCallback(async () => {
    if (!user || isSessionExpired()) {
      if (user && isSessionExpired()) {
        logger.warn('AuthProvider', 'Sessão expirada detectada');
        await forceLogout();
      }
      return false;
    }

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        logger.warn('AuthProvider', 'Sessão inválida detectada');
        await forceLogout();
        return false;
      }
      
      return true;
    } catch (error) {
      logger.error('AuthProvider', 'Erro ao validar sessão', error);
      return false;
    }
  }, [user, isSessionExpired, forceLogout]);

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
    
    // SECURITY: Log de evento de segurança
    if (isProductionEnvironment()) {
      console.error('SECURITY EVENT: Auth error in production', { context, error: error?.message });
    }
    
    if (error?.code !== 'PGRST301' && error?.message !== 'JWT expired') {
      toast.error(`Erro de autenticação: ${error.message || 'Erro desconhecido'}`);
    }
    
    if (error?.message?.includes('JWT expired') || error?.code === 'PGRST301') {
      logger.info('AuthProvider', 'Tentando recuperação automática');
      setTimeout(() => {
        if (retryCount < SECURITY_CONSTANTS.MAX_RETRY_ATTEMPTS) {
          setRetryCount(prev => prev + 1);
          reconnect();
        } else {
          logger.warn('AuthProvider', 'Máximo de tentativas atingido, forçando logout');
          forceLogout();
        }
      }, SECURITY_CONSTANTS.RETRY_DELAY);
    }
  };

  // SECURITY: Verificação periódica de atividade
  useEffect(() => {
    const activityInterval = setInterval(async () => {
      if (user && !bypassAuth) {
        const isValid = await validateSession();
        if (!isValid) {
          clearInterval(activityInterval);
        }
      }
    }, SECURITY_CONSTANTS.ACTIVITY_CHECK_INTERVAL);

    return () => clearInterval(activityInterval);
  }, [user, bypassAuth, validateSession]);

  // SECURITY: Listeners de atividade do usuário
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const activityHandler = () => {
      updateLastActivity();
    };

    events.forEach(event => {
      document.addEventListener(event, activityHandler, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, activityHandler, true);
      });
    };
  }, [updateLastActivity]);

  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    logger.debug('AuthProvider', 'Buscando perfil do usuário');
    try {
      const profile = await authOptimization.getUserProfileOptimized(userId);
      
      if (!profile) {
        logger.info('AuthProvider', 'Perfil não encontrado para usuário');
        return null;
      }

      // SECURITY: Validar se perfil está ativo
      if (!profile.is_active) {
        logger.warn('AuthProvider', 'Perfil do usuário está inativo');
        throw new Error('User profile is inactive');
      }

      logger.debug('AuthProvider', 'Perfil do usuário encontrado');
      return profile;
    } catch (error) {
      handleError(error, 'fetchUserProfile');
      return null;
    }
  };

  const fetchUserCompany = async (companyId: string): Promise<Company | null> => {
    logger.debug('AuthProvider', 'Buscando empresa');
    try {
      const { data: company, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .eq('active', true) // SECURITY: Apenas empresas ativas
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          logger.info('AuthProvider', 'Empresa não encontrada ou inativa');
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
    logger.debug('AuthProvider', 'Inicializando usuário');
    
    if (!user) {
      logger.debug('AuthProvider', 'Usuário null, limpando estado');
      setUserProfile(null);
      setUserCompany(null);
      setSessionExpiry(null);
      setLastActivity(null);
      setLoading(false);
      setConnectionStatus('connected');
      clearAuthError();
      return;
    }

    try {
      // SECURITY: Configurar expiração da sessão
      setSessionExpiry(new Date(Date.now() + SECURITY_CONSTANTS.SESSION_TIMEOUT));
      updateLastActivity();
      
      logger.debug('AuthProvider', 'Buscando dados do usuário');
      
      const profile = await fetchUserProfile(user.id);
      setUserProfile(profile);

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
    
    // SECURITY: Validar entrada
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios');
    }
    
    if (!email.includes('@')) {
      throw new Error('Email inválido');
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        logger.error('AuthProvider', 'Erro no login', error);
        handleError(error, 'signIn');
        throw error;
      }

      logger.info('AuthProvider', 'Login realizado com sucesso');
      updateLastActivity();

      if (data.user) {
        try {
          await supabase
            .from('user_profiles')
            .update({ last_login: new Date().toISOString() })
            .eq('id', data.user.id);
        } catch (updateError) {
          logger.warn('AuthProvider', 'Erro ao atualizar last_login', updateError);
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
      setSessionExpiry(null);
      setLastActivity(null);
      toast.success('Logout realizado com sucesso');
    } catch (error: any) {
      logger.error('AuthProvider', 'Erro no logout', error);
      handleError(error, 'signOut');
      // Mesmo com erro, limpar estado local
      setUser(null);
      setUserProfile(null);
      setUserCompany(null);
      setSessionExpiry(null);
      setLastActivity(null);
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

  // SECURITY: Permissões com validação adicional
  const isSuperAdmin = (bypassAuth && isLovableEditor) || (userProfile?.is_super_admin ?? false);
  const isCompanyAdmin = (bypassAuth && isLovableEditor) || (userProfile?.is_company_admin ?? false);
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
    isLoading: loading,
    connectionStatus,
    signOut,
    signIn,
    signUp,
    reconnect,
    isSuperAdmin,
    isCompanyAdmin,
    isAdmin,
    empresaId: userProfile?.company_id,
    hasAuthError,
    clearAuthError,
    // SECURITY: Novos campos
    sessionExpiry,
    lastActivity,
    forceLogout,
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
