import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { isLovableEditor, isSuperAdminInLovable } from "@/utils/lovableEditorDetection";

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

  const isEditorAdmin = isSuperAdminInLovable();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check admin status when auth state changes
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          // Check if user is in Lovable editor and grant super admin privileges
          setIsAdmin(isEditorAdmin);
          setIsSuperAdmin(isEditorAdmin);
          setIsCompanyAdmin(isEditorAdmin);
          
          if (!isEditorAdmin) {
            setUserCompany(null);
          }
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        // Check if user is in Lovable editor and grant super admin privileges
        setIsAdmin(isEditorAdmin);
        setIsSuperAdmin(isEditorAdmin);
        setIsCompanyAdmin(isEditorAdmin);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [isEditorAdmin]);

  const fetchUserProfile = async (userId: string) => {
    try {
      // Buscar perfil do usuário
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
        // Definir status de admin
        setIsSuperAdmin(profileData.is_super_admin || false);
        setIsCompanyAdmin(profileData.is_company_admin || false);
        setIsAdmin(profileData.is_super_admin || profileData.is_company_admin || false);
        
        // Definir empresa do usuário
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
