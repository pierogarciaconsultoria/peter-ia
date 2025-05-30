
import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CompanyManagement from '@/components/admin/CompanyManagement';
import UserManagement from '@/components/admin/UserManagement';
import { PermissoesUsuarios } from '@/components/admin/PermissoesUsuarios';
import { AdminAdvancedSettings } from '@/components/admin/AdminAdvancedSettings';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Building2, Users, Lock } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState(isSuperAdmin ? 'empresas' : 'usuarios');
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
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Administração do Sistema</h1>
          <p className="text-gray-600 text-sm md:text-base">
            Gerencie empresas, usuários e configurações do sistema
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 gap-2 h-auto p-2 bg-muted">
          {isSuperAdmin && (
            <TabsTrigger 
              value="empresas" 
              className="flex flex-col items-center gap-2 h-16 md:h-12 md:flex-row data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Building2 className="h-5 w-5" />
              <span className="text-xs md:text-sm font-medium">Empresas</span>
            </TabsTrigger>
          )}
          
          <TabsTrigger 
            value="usuarios" 
            className="flex flex-col items-center gap-2 h-16 md:h-12 md:flex-row data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Users className="h-5 w-5" />
            <span className="text-xs md:text-sm font-medium">Usuários</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="acesso" 
            className="flex flex-col items-center gap-2 h-16 md:h-12 md:flex-row data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Lock className="h-5 w-5" />
            <span className="text-xs md:text-sm font-medium">Acesso</span>
          </TabsTrigger>

          {isSuperAdmin && (
            <TabsTrigger 
              value="avancado" 
              className="flex flex-col items-center gap-2 h-16 md:h-12 md:flex-row data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Shield className="h-5 w-5" />
              <span className="text-xs md:text-sm font-medium">Avançado</span>
            </TabsTrigger>
          )}
        </TabsList>

        {isSuperAdmin && (
          <TabsContent value="empresas" className="space-y-6">
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

        <TabsContent value="usuarios" className="space-y-6">
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

        <TabsContent value="acesso" className="space-y-6">
          <PermissoesUsuarios />
        </TabsContent>

        {isSuperAdmin && (
          <TabsContent value="avancado" className="space-y-6">
            <AdminAdvancedSettings 
              roles={roles}
              companies={companies}
              users={users}
              loading={loading}
              fetchRoles={fetchRoles}
              fetchCompanies={fetchCompanies}
              fetchUsers={fetchUsers}
              setItemToDelete={setItemToDelete}
              setDeleteDialogOpen={setDeleteDialogOpen}
              isSuperAdmin={isSuperAdmin}
              userCompany={userCompany}
            />
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
