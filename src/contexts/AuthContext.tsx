
import React, { createContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define the AuthContext type
type AuthContextType = {
  user: any | null;
  userCompany: any | null;
  userTeams: any[] | null;
  userRoles: string[] | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  refetchUserData: () => Promise<void>;
};

// Create the context with a default value
export const AuthContext = createContext<AuthContextType>({
  user: null,
  userCompany: null,
  userTeams: null,
  userRoles: null,
  isAdmin: false,
  isAuthenticated: false,
  loading: true,
  signIn: async () => null,
  signOut: async () => {},
  refetchUserData: async () => {},
});

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [userCompany, setUserCompany] = useState<any | null>(null);
  const [userTeams, setUserTeams] = useState<any[] | null>(null);
  const [userRoles, setUserRoles] = useState<string[] | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const fetchUserData = async (userId: string) => {
    try {
      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Get user company
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', profileData?.company_id)
        .maybeSingle();

      if (companyError) throw companyError;
      
      // Get user roles
      const { data: userRolesData, error: userRolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (userRolesError) throw userRolesError;

      // Get user teams
      const { data: userTeamsData, error: userTeamsError } = await supabase
        .from('user_teams')
        .select('team_id, teams(*)')
        .eq('user_id', userId);

      if (userTeamsError) throw userTeamsError;

      // Update state with fetched data
      setUserCompany(companyData);
      setUserTeams(userTeamsData?.map(item => item.teams));
      
      const roles = userRolesData?.map(item => item.role) || [];
      setUserRoles(roles);
      setIsAdmin(roles.includes('admin'));

    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setUser(data.user);
      
      if (data.user) {
        await fetchUserData(data.user.id);
      }

      return data;
    } catch (error: any) {
      toast({
        title: "Falha no login",
        description: error.message || "Ocorreu um erro ao realizar o login",
        variant: "destructive",
      });
      throw error;
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
    } catch (error: any) {
      toast({
        title: "Erro ao sair",
        description: error.message || "Ocorreu um erro ao encerrar a sessão",
        variant: "destructive",
      });
    }
  };

  const refetchUserData = async () => {
    if (user) {
      await fetchUserData(user.id);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session?.user) {
          setUser(session.user);
          await fetchUserData(session.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchUserData(session.user.id);
      } else {
        setUser(null);
        setUserCompany(null);
        setUserTeams(null);
        setUserRoles(null);
        setIsAdmin(false);
      }
    });

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const value = {
    user,
    userCompany,
    userTeams,
    userRoles,
    isAdmin,
    isAuthenticated: !!user,
    loading,
    signIn,
    signOut,
    refetchUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
