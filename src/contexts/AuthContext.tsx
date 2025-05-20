
import React, { createContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { isProductionEnvironment } from '@/utils/lovableEditorDetection';

// Define the AuthContext type
type AuthContextType = {
  user: any | null;
  userCompany: any | null;
  userTeams: any[] | null;
  userRoles: string[] | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isCompanyAdmin: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  error: Error | null;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  refetchUserData: () => Promise<void>;
  reconnect: () => Promise<void>;
};

// Create the context with a default value
export const AuthContext = createContext<AuthContextType>({
  user: null,
  userCompany: null,
  userTeams: null,
  userRoles: null,
  isAdmin: false,
  isSuperAdmin: false,
  isCompanyAdmin: false,
  isAuthenticated: false,
  loading: true,
  error: null,
  connectionStatus: 'connecting',
  signIn: async () => null,
  signOut: async () => {},
  refetchUserData: async () => {},
  reconnect: async () => {},
});

export interface AuthProviderProps {
  children: React.ReactNode;
}

const MAX_RETRIES = 3;

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [userCompany, setUserCompany] = useState<any | null>(null);
  const [userTeams, setUserTeams] = useState<any[] | null>(null);
  const [userRoles, setUserRoles] = useState<string[] | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
  const [isCompanyAdmin, setIsCompanyAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');
  const [retryCount, setRetryCount] = useState(0);

  const fetchUserData = useCallback(async (userId: string, attempt = 1) => {
    try {
      setConnectionStatus('connecting');
      setError(null);
      
      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        if (attempt <= MAX_RETRIES) {
          console.log(`Retry attempt ${attempt} for fetching user data`);
          setTimeout(() => fetchUserData(userId, attempt + 1), 1000 * attempt);
          return;
        }
        throw profileError;
      }

      // Get user company
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', profileData?.company_id)
        .maybeSingle();

      if (companyError && attempt <= MAX_RETRIES) {
        setTimeout(() => fetchUserData(userId, attempt + 1), 1000 * attempt);
        return;
      }
      
      // Get user roles from user_profiles
      // Check if this is our master admin
      const isMasterAdmin = userId === profileData?.id && profileData?.email === "contato@pierogarcia.com.br";
      const roles = profileData?.role ? [profileData.role] : [];
      
      if (isMasterAdmin && !roles.includes('super_admin')) {
        roles.push('super_admin');
      }
      
      // Determine admin status
      const isUserAdmin = roles.includes('admin') || isMasterAdmin;
      const isUserCompanyAdmin = roles.includes('company_admin') || isMasterAdmin;
      const isUserSuperAdmin = roles.includes('super_admin') || isMasterAdmin;
      
      // Update state with fetched data
      setUserCompany(companyData);
      setUserTeams([]); // Initialize with empty array since user_teams table might not exist yet
      setUserRoles(roles);
      setIsAdmin(isUserAdmin || isUserCompanyAdmin || isUserSuperAdmin);
      setIsSuperAdmin(isUserSuperAdmin);
      setIsCompanyAdmin(isUserCompanyAdmin);
      setConnectionStatus('connected');
      setRetryCount(0);

    } catch (error: any) {
      console.error('Error fetching user data:', error);
      setConnectionStatus('disconnected');
      setError(error);
      
      if (isProductionEnvironment()) {
        toast.error('Erro de conexão', {
          description: 'Houve um problema ao carregar seus dados. Tente novamente.',
        });
      }
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      setConnectionStatus('connecting');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setUser(data.user);
      
      if (data.user) {
        await fetchUserData(data.user.id);
      }

      if (isProductionEnvironment()) {
        toast.success('Login realizado com sucesso!');
      }

      return data;
    } catch (error: any) {
      setError(error);
      setConnectionStatus('disconnected');
      
      toast.error("Falha no login", {
        description: error.message || "Ocorreu um erro ao realizar o login",
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserCompany(null);
      setUserTeams(null);
      setUserRoles(null);
      setIsAdmin(false);
      setIsSuperAdmin(false);
      setIsCompanyAdmin(false);
    } catch (error: any) {
      setError(error);
      
      toast.error("Erro ao sair", {
        description: error.message || "Ocorreu um erro ao encerrar a sessão",
      });
    }
  };

  const reconnect = async () => {
    if (!user) return;
    
    setLoading(true);
    setConnectionStatus('connecting');
    
    try {
      // Try to reestablish connection
      const { data, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (data.session?.user) {
        setUser(data.session.user);
        await fetchUserData(data.session.user.id);
        toast.success('Conexão reestabelecida!');
      } else {
        // No valid session, redirect to login
        toast.error('Sessão expirada', {
          description: 'Por favor, faça login novamente.'
        });
        await signOut();
      }
    } catch (error: any) {
      setError(error);
      toast.error('Falha ao reconectar', {
        description: error.message || 'Não foi possível reconectar ao servidor'
      });
    } finally {
      setLoading(false);
    }
  };

  const refetchUserData = async () => {
    if (user) {
      setLoading(true);
      await fetchUserData(user.id);
      setLoading(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      setConnectionStatus('connecting');
      
      try {
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session?.user) {
          setUser(session.user);
          await fetchUserData(session.user.id);
        } else {
          setConnectionStatus('connected'); // Still connected, just no user
        }
      } catch (error: any) {
        console.error('Error initializing auth:', error);
        setConnectionStatus('disconnected');
        setError(error);
        
        if (isProductionEnvironment()) {
          toast.error('Erro de conexão', {
            description: 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
          });
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          setUser(session.user);
          await fetchUserData(session.user.id);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserCompany(null);
        setUserTeams(null);
        setUserRoles(null);
        setIsAdmin(false);
        setIsSuperAdmin(false);
        setIsCompanyAdmin(false);
      }
    });

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [fetchUserData]);

  const value = {
    user,
    userCompany,
    userTeams,
    userRoles,
    isAdmin,
    isSuperAdmin,
    isCompanyAdmin,
    isAuthenticated: !!user,
    loading,
    error,
    connectionStatus,
    signIn,
    signOut,
    refetchUserData,
    reconnect,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
