
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthGuard } from "@/components/AuthGuard";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import CompanyManagement from "@/components/admin/CompanyManagement";
import UserManagement from "@/components/admin/UserManagement";
import RoleManagement from "@/components/admin/RoleManagement";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import { isSuperAdminInLovable } from "@/utils/lovableEditorDetection";
import { executeQuery } from "@/utils/databaseHelpers";

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: 'user' | 'company' | 'role'} | null>(null);
  
  const isEditorSuperAdmin = isSuperAdminInLovable();

  useEffect(() => {
    fetchCompanies();
    fetchUsers();
    fetchRoles();
  }, [isSuperAdmin, isCompanyAdmin, userCompany]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      
      if (isEditorSuperAdmin) {
        const result = await executeQuery('SELECT * FROM public.companies ORDER BY name');
        
        if (!result.success) {
          console.error("Error executing SQL for companies:", result.error);
          toast.error("Erro ao carregar empresas");
          setCompanies([]);
          setLoading(false);
          return;
        }
        
        setCompanies(result.data || []);
      } else {
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
      }
    } catch (error) {
      console.error("Error in fetchCompanies:", error);
      toast.error("Erro ao carregar empresas");
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      if (isEditorSuperAdmin) {
        const result = await executeQuery(`
          SELECT p.*, c.name as company_name
          FROM public.user_profiles p
          LEFT JOIN public.companies c ON p.company_id = c.id
          ORDER BY p.created_at DESC
        `);
        
        if (!result.success) {
          console.error("Error executing SQL for users:", result.error);
          toast.error("Erro ao carregar usuários");
          setUsers([]);
          setLoading(false);
          return;
        }
        
        setUsers(result.data || []);
      } else {
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
      }
    } catch (error) {
      console.error("Error in fetchUsers:", error);
      toast.error("Erro ao carregar usuários");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      if (isEditorSuperAdmin) {
        const result = await executeQuery(`
          SELECT r.*, c.name as company_name
          FROM public.roles r
          LEFT JOIN public.companies c ON r.company_id = c.id
          ORDER BY r.name
        `);
        
        if (!result.success) {
          console.error("Error executing SQL for roles:", result.error);
          toast.error("Erro ao carregar papéis");
          setRoles([]);
          return;
        }
        
        setRoles(result.data || []);
      } else {
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
      }
    } catch (error) {
      console.error("Error in fetchRoles:", error);
      toast.error("Erro ao carregar papéis");
      setRoles([]);
    }
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    
    setLoading(true);
    try {
      if (isEditorSuperAdmin) {
        let sqlQuery = "";
        
        if (itemToDelete.type === 'user') {
          sqlQuery = `DELETE FROM auth.users WHERE id = '${itemToDelete.id}';`;
        } else if (itemToDelete.type === 'company') {
          sqlQuery = `DELETE FROM public.companies WHERE id = '${itemToDelete.id}';`;
        } else if (itemToDelete.type === 'role') {
          sqlQuery = `DELETE FROM public.roles WHERE id = '${itemToDelete.id}';`;
        }
        
        const result = await executeQuery(sqlQuery);
        
        if (!result.success) throw new Error(result.error);
        
        if (itemToDelete.type === 'user') fetchUsers();
        else if (itemToDelete.type === 'company') fetchCompanies();
        else if (itemToDelete.type === 'role') fetchRoles();
      } else {
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
            
            <Tabs defaultValue={isSuperAdmin ? "companies" : "users"}>
              <TabsList className="mb-4">
                {isSuperAdmin && <TabsTrigger value="companies">Empresas</TabsTrigger>}
                <TabsTrigger value="users">Usuários</TabsTrigger>
                <TabsTrigger value="roles">Papéis</TabsTrigger>
              </TabsList>
              
              {isSuperAdmin && (
                <TabsContent value="companies" className="space-y-4">
                  <CompanyManagement
                    companies={companies}
                    loading={loading}
                    fetchCompanies={fetchCompanies}
                    setItemToDelete={setItemToDelete}
                    setDeleteDialogOpen={setDeleteDialogOpen}
                    isSuperAdmin={isSuperAdmin}
                  />
                </TabsContent>
              )}
              
              <TabsContent value="users" className="space-y-4">
                <UserManagement
                  users={users}
                  companies={companies}
                  loading={loading}
                  fetchUsers={fetchUsers}
                  setItemToDelete={setItemToDelete}
                  setDeleteDialogOpen={setDeleteDialogOpen}
                  isSuperAdmin={isSuperAdmin}
                  userCompany={userCompany}
                />
              </TabsContent>
              
              <TabsContent value="roles" className="space-y-4">
                <RoleManagement
                  roles={roles}
                  companies={companies}
                  loading={loading}
                  fetchRoles={fetchRoles}
                  setItemToDelete={setItemToDelete}
                  setDeleteDialogOpen={setDeleteDialogOpen}
                  isSuperAdmin={isSuperAdmin}
                  userCompany={userCompany}
                />
              </TabsContent>
            </Tabs>
            
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
