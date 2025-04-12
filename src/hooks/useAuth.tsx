import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { isSuperAdminInLovable, shouldGrantFreeAccess } from "@/utils/lovableEditorDetection";

interface CompanyProfile {
  id: string;
  name: string;
  slug: string;
}

interface UserMetadata {
  first_name?: string;
  last_name?: string;
  is_super_admin?: boolean;
  is_company_admin?: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<any>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isCompanyAdmin: boolean;
  userCompany: CompanyProfile | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
  const [isCompanyAdmin, setIsCompanyAdmin] = useState<boolean>(false);
  const [userCompany, setUserCompany] = useState<CompanyProfile | null>(null);

  const isMasterLovable = isSuperAdminInLovable();
  const isFreeAccessEnabled = shouldGrantFreeAccess();

  useEffect(() => {
    if (isFreeAccessEnabled) {
      console.log("Acesso gratuito habilitado - concedendo acesso automático");
      setIsAdmin(true);
      setIsSuperAdmin(true);
      setIsCompanyAdmin(true);
      setIsLoading(false);
      
      const demoCompany = {
        id: "demo-company-id",
        name: "Empresa Demo",
        slug: "empresa-demo"
      };
      setUserCompany(demoCompany);
      
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          setIsAdmin(isMasterLovable);
          setIsSuperAdmin(isMasterLovable);
          setIsCompanyAdmin(isMasterLovable);
          
          if (!isMasterLovable) {
            setUserCompany(null);
          }
        }
        
        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setIsAdmin(isMasterLovable);
        setIsSuperAdmin(isMasterLovable);
        setIsCompanyAdmin(isMasterLovable);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [isMasterLovable, isFreeAccessEnabled]);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*, companies:company_id(*)')
        .eq('id', userId)
        .single();
      
      if (profileError) {
        console.error("Error fetching user profile:", profileError);
        return;
      }
      
      if (profileData) {
        setIsSuperAdmin(profileData.is_super_admin || false);
        setIsCompanyAdmin(profileData.is_company_admin || false);
        setIsAdmin(profileData.is_super_admin || profileData.is_company_admin || false);
        
        if (profileData.companies) {
          setUserCompany({
            id: profileData.companies.id,
            name: profileData.companies.name,
            slug: profileData.companies.slug
          });
        }
      }
    } catch (error) {
      console.error("Error in fetch user profile:", error);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (isFreeAccessEnabled) {
      toast.success("Acesso concedido automaticamente");
      return { user: null, session: null };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      toast.success("Login realizado com sucesso");
      return data;
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Erro ao fazer login");
      throw error;
    }
  };

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    if (isFreeAccessEnabled) {
      toast.success("Acesso concedido automaticamente");
      return { user: null, session: null };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) throw error;
      
      toast.success("Cadastro realizado com sucesso");
      return data;
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Erro ao fazer cadastro");
      throw error;
    }
  };

  const signOut = async () => {
    if (isFreeAccessEnabled) {
      toast.success("Logout simulado no modo de acesso gratuito");
      return;
    }

    try {
      await supabase.auth.signOut();
      toast.success("Logout realizado com sucesso");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(error.message || "Erro ao fazer logout");
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isSuperAdmin,
    isCompanyAdmin,
    userCompany,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
