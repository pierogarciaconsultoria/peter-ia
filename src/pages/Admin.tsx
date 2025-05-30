
import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CompanyManagement from '@/components/admin/CompanyManagement';
import UserManagement from '@/components/admin/UserManagement';
import RoleManagement from '@/components/admin/RoleManagement';
import { PermissoesUsuarios } from '@/components/admin/PermissoesUsuarios';
import CentralizedRegistration from '@/components/admin/CentralizedRegistration';
import { DatabaseConnectionStatus } from '@/components/admin/DatabaseConnectionStatus';
import { ModuleAssistantSettings } from '@/components/admin/ModuleAssistantSettings';
import { PerformanceDashboard } from '@/components/admin/PerformanceDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Users, Building2, Settings, Database, Bot, Gauge, UserCog } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(false);
  
  // State for data
  const [companies, setCompanies] = useState<Company[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: 'user' | 'company' | 'role'} | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCompanies = useCallback(async () => {
    if (!isSuperAdmin) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name');

      if (error) throw error;
      setCompanies(data || []);
    } catch (error: any) {
      console.error('Error fetching companies:', error);
      toast.error('Erro ao carregar empresas');
    } finally {
      setLoading(false);
    }
  }, [isSuperAdmin]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('user_profiles')
        .select(`
          *,
          companies(name)
        `)
        .order('first_name');

      // Se não é super admin, filtrar apenas usuários da empresa
      if (!isSuperAdmin && userCompany) {
        query = query.eq('company_id', userCompany.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      const formattedUsers = (data || []).map(user => ({
        ...user,
        company_name: user.companies?.name
      }));
      
      setUsers(formattedUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  }, [isSuperAdmin, userCompany]);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('roles')
        .select(`
          *,
          companies(name)
        `)
        .order('name');

      // Se não é super admin, filtrar apenas roles da empresa
      if (!isSuperAdmin && userCompany) {
        query = query.eq('company_id', userCompany.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      const formattedRoles = (data || []).map(role => ({
        ...role,
        company_name: role.companies?.name
      }));
      
      setRoles(formattedRoles);
    } catch (error: any) {
      console.error('Error fetching roles:', error);
      toast.error('Erro ao carregar papéis');
    } finally {
      setLoading(false);
    }
  }, [isSuperAdmin, userCompany]);

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleting(true);
    try {
      const { error } = await supabase
        .from(itemToDelete.type === 'user' ? 'user_profiles' : 
              itemToDelete.type === 'company' ? 'companies' : 'roles')
        .delete()
        .eq('id', itemToDelete.id);

      if (error) throw error;

      toast.success(`${itemToDelete.type === 'user' ? 'Usuário' : 
                     itemToDelete.type === 'company' ? 'Empresa' : 'Papel'} excluído com sucesso`);
      
      // Refresh data
      if (itemToDelete.type === 'user') {
        await fetchUsers();
      } else if (itemToDelete.type === 'company') {
        await fetchCompanies();
      } else {
        await fetchRoles();
      }
      
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error: any) {
      console.error('Error deleting item:', error);
      toast.error('Erro ao excluir item');
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin || isCompanyAdmin) {
      fetchUsers();
      fetchRoles();
      if (isSuperAdmin) {
        fetchCompanies();
      }
    }
  }, [isSuperAdmin, isCompanyAdmin, fetchUsers, fetchRoles, fetchCompanies]);

  if (!isSuperAdmin && !isCompanyAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Acesso Restrito</h2>
          <p className="text-gray-600">Você não tem permissão para acessar esta área.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Administração do Sistema</h1>
          <p className="text-gray-600">Gerencie usuários, empresas e configurações do sistema</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Usuários</span>
          </TabsTrigger>
          
          {isSuperAdmin && (
            <TabsTrigger value="companies" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Empresas</span>
            </TabsTrigger>
          )}
          
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            <span className="hidden sm:inline">Roles</span>
          </TabsTrigger>
          
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Permissões</span>
          </TabsTrigger>
          
          {isSuperAdmin && (
            <TabsTrigger value="registration" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Cadastros</span>
            </TabsTrigger>
          )}
          
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Database</span>
          </TabsTrigger>
          
          <TabsTrigger value="assistants" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            <span className="hidden sm:inline">Assistentes</span>
          </TabsTrigger>

          {isSuperAdmin && (
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              <span className="hidden sm:inline">Performance</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="users" className="space-y-6">
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

        {isSuperAdmin && (
          <TabsContent value="companies" className="space-y-6">
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

        <TabsContent value="roles" className="space-y-6">
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

        <TabsContent value="permissions" className="space-y-6">
          <PermissoesUsuarios />
        </TabsContent>

        {isSuperAdmin && (
          <TabsContent value="registration" className="space-y-6">
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
        )}

        <TabsContent value="database" className="space-y-6">
          <DatabaseConnectionStatus />
        </TabsContent>

        <TabsContent value="assistants" className="space-y-6">
          <ModuleAssistantSettings isAdmin={isSuperAdmin || isCompanyAdmin} />
        </TabsContent>

        {isSuperAdmin && (
          <TabsContent value="performance" className="space-y-6">
            <PerformanceDashboard />
          </TabsContent>
        )}
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este{' '}
              {itemToDelete?.type === 'user' ? 'usuário' : 
               itemToDelete?.type === 'company' ? 'empresa' : 'papel'}?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
