
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthGuard } from "@/components/AuthGuard";
import { Navigation } from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import CentralizedRegistration from "@/components/admin/CentralizedRegistration";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import { isSuperAdminInLovable, shouldGrantFreeAccess } from "@/utils/lovableEditorDetection";
import { executeQuery } from "@/utils/databaseHelpers";
import { ModuleAssistantSettings } from "@/components/admin/ModuleAssistantSettings";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Company {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  active_modules: string[];
  active: boolean;
  address?: string;
  cnpj?: string;
  email?: string;
  phone?: string;
  plan?: string;
  potency?: string;
  responsible?: string;
  settings?: any;
}

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company_id: string;
  company_name?: string;
  is_super_admin: boolean;
  is_company_admin: boolean;
  created_at: string;
  last_login: string;
  is_active: boolean;
}

interface Role {
  id: string;
  name: string;
  company_id: string;
  company_name?: string;
  is_admin?: boolean;
  is_default?: boolean;
  created_at?: string;
  companies?: { name: string };
}

const Admin = () => {
  const { isSuperAdmin, isCompanyAdmin, userCompany } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: 'user' | 'company' | 'role'} | null>(null);
  
  const isEditorSuperAdmin = isSuperAdminInLovable();
  const isFreeAccessEnabled = shouldGrantFreeAccess();

  useEffect(() => {
    fetchData();
  }, [isSuperAdmin, isCompanyAdmin, userCompany]);
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchCompanies(),
        fetchUsers(),
        fetchRoles()
      ]);
    } catch (error: any) {
      console.error("Error fetching admin data:", error);
      setError(error.message || "Falha ao carregar dados administrativos");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      let query = supabase.from('companies').select('*');
      
      if (!isSuperAdmin && userCompany) {
        query = query.eq('id', userCompany.id);
      }
      
      const { data, error } = await query.order('name');
        
      if (error) {
        console.error("Error fetching companies:", error);
        toast.error("Erro ao carregar empresas");
        setCompanies([]);
      } else {
        const formattedCompanies = (data || []).map(company => ({
          ...company,
          active: company.active !== undefined ? company.active : true
        }));
        
        setCompanies(formattedCompanies);
      }
    } catch (error) {
      console.error("Error in fetchCompanies:", error);
      throw error;
    }
  };

  const fetchUsers = async () => {
    try {
      let query = supabase
        .from('user_profiles')
        .select(`
          *,
          companies:company_id (name)
        `);
      
      if (!isSuperAdmin && userCompany) {
        query = query.eq('company_id', userCompany.id);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching users:", error);
        toast.error("Erro ao carregar usuários");
        setUsers([]);
      } else {
        const formattedUsers = data?.map(user => ({
          ...user,
          company_name: user.companies?.name
        }));
        
        setUsers(formattedUsers || []);
      }
    } catch (error) {
      console.error("Error in fetchUsers:", error);
      throw error;
    }
  };

  const fetchRoles = async () => {
    try {
      let query = supabase
        .from('roles')
        .select(`
          *,
          companies:company_id (name)
        `);
      
      if (!isSuperAdmin && userCompany) {
        query = query.eq('company_id', userCompany.id);
      }
      
      const { data, error } = await query.order('name');
        
      if (error) {
        console.error("Error fetching roles:", error);
        toast.error("Erro ao carregar papéis");
        setRoles([]);
      } else {
        const formattedRoles = (data || []).map(role => {
          const typedRole: Role = {
            ...role as any,
            company_name: role.companies?.name,
            is_admin: false
          };
          
          return typedRole;
        });
        
        setRoles(formattedRoles);
      }
    } catch (error) {
      console.error("Error in fetchRoles:", error);
      throw error;
    }
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    
    setLoading(true);
    try {
      if (itemToDelete.type === 'user') {
        if (!isSuperAdmin) {
          const userToDelete = users.find(u => u.id === itemToDelete.id);
          if (userToDelete?.is_super_admin) {
            throw new Error("Você não tem permissão para excluir um Super Admin");
          }
          if (userToDelete?.company_id !== userCompany?.id) {
            throw new Error("Você só pode excluir usuários da sua empresa");
          }
        }
        
        const { error } = await supabase.auth.admin.deleteUser(itemToDelete.id);
        if (error) throw error;
        fetchUsers();
      } else if (itemToDelete.type === 'company') {
        if (!isSuperAdmin) {
          throw new Error("Apenas administradores do sistema podem excluir empresas");
        }
        
        const { error } = await supabase
          .from('companies')
          .delete()
          .eq('id', itemToDelete.id);
          
        if (error) throw error;
        fetchCompanies();
      } else if (itemToDelete.type === 'role') {
        const roleToDelete = roles.find(r => r.id === itemToDelete.id);
        
        if (!isSuperAdmin && roleToDelete?.company_id !== userCompany?.id) {
          throw new Error("Você só pode excluir papéis da sua empresa");
        }
        
        const { error } = await supabase
          .from('roles')
          .delete()
          .eq('id', itemToDelete.id);
          
        if (error) throw error;
        fetchRoles();
      }
      
      toast.success(`${
        itemToDelete.type === 'user' ? 'Usuário' : 
        itemToDelete.type === 'company' ? 'Empresa' : 'Papel'
      } excluído(a) com sucesso`);
    } catch (error: any) {
      console.error(`Error deleting ${itemToDelete.type}:`, error);
      toast.error(error.message || `Erro ao excluir ${
        itemToDelete.type === 'user' ? 'usuário' : 
        itemToDelete.type === 'company' ? 'empresa' : 'papel'
      }`);
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };
  
  // Function to render content based on error status
  const renderContent = () => {
    if (error) {
      return (
        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erro ao carregar dados administrativos</AlertTitle>
            <AlertDescription>
              {error}
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchData}
                  className="flex items-center"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Tentar novamente
                </Button>
              </div>
            </AlertDescription>
          </Alert>
          
          {(isEditorSuperAdmin || isFreeAccessEnabled) && (
            <div className="mt-4">
              <Alert>
                <AlertTitle>Acesso especial disponível</AlertTitle>
                <AlertDescription>
                  Você está acessando o sistema via Lovable Editor ou com acesso gratuito.
                  Algumas funcionalidades administrativas podem funcionar com dados simulados.
                </AlertDescription>
              </Alert>
              
              <div className="mt-4">
                <Tabs defaultValue="assistants">
                  <TabsList>
                    <TabsTrigger value="assistants">Assistentes</TabsTrigger>
                  </TabsList>
                  <TabsContent value="assistants">
                    <ModuleAssistantSettings isAdmin={true} />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </div>
      );
    }
    
    return (
      <Tabs defaultValue="cadastros">
        <TabsList className="mb-4">
          <TabsTrigger value="cadastros">Cadastros</TabsTrigger>
          {(isSuperAdmin || isEditorSuperAdmin) && <TabsTrigger value="assistants">Assistentes</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="cadastros" className="space-y-4">
          <CentralizedRegistration
            companies={companies}
            users={users}
            roles={roles}
            loading={loading}
            fetchCompanies={fetchCompanies}
            fetchUsers={fetchUsers}
            fetchRoles={fetchRoles}
            setItemToDelete={setItemToDelete}
            setDeleteDialogOpen={setDeleteDialogOpen}
            isSuperAdmin={isSuperAdmin}
            userCompany={userCompany}
          />
        </TabsContent>
        
        {(isSuperAdmin || isEditorSuperAdmin) && (
          <TabsContent value="assistants" className="space-y-4">
            <ModuleAssistantSettings isAdmin={isSuperAdmin || isEditorSuperAdmin} />
          </TabsContent>
        )}
      </Tabs>
    );
  };

  return (
    <AuthGuard requireAdmin={true}>
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        
        <main className="md:pl-64 p-6 transition-all duration-300 flex-1">
          <div className="max-w-6xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Administração</h1>
              <p className="text-muted-foreground">
                {isSuperAdmin 
                  ? "Gerencie empresas, usuários e permissões do sistema" 
                  : "Gerencie usuários e permissões da sua empresa"}
              </p>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                <span className="ml-3 text-lg">Carregando dados administrativos...</span>
              </div>
            ) : (
              renderContent()
            )}
            
            <DeleteConfirmDialog
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
              itemToDelete={itemToDelete}
              onDelete={handleDeleteItem}
              loading={loading}
            />
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default Admin;
