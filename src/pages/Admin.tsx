import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthGuard } from "@/components/AuthGuard";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Plus, Trash2, User, Building2, CheckSquare, Shield } from "lucide-react";
import { isSuperAdminInLovable } from "@/utils/lovableEditorDetection";
import { executeQuery, verificarEmpresaSalva } from "@/utils/databaseHelpers";

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
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [companyDialogOpen, setCompanyDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: 'user' | 'company' | 'role'} | null>(null);
  
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserFirstName, setNewUserFirstName] = useState("");
  const [newUserLastName, setNewUserLastName] = useState("");
  const [newUserCompany, setNewUserCompany] = useState("");
  const [newUserIsAdmin, setNewUserIsAdmin] = useState(false);
  
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanySlug, setNewCompanySlug] = useState("");

  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleCompany, setNewRoleCompany] = useState("");
  const [newRoleIsAdmin, setNewRoleIsAdmin] = useState(false);
  const [newRoleIsDefault, setNewRoleIsDefault] = useState(false);
  
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

  const handleCreateUser = async () => {
    setLoading(true);
    try {
      const companyId = isSuperAdmin ? newUserCompany : (userCompany?.id || null);
      
      if (!companyId) {
        throw new Error("É necessário selecionar uma empresa");
      }

      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newUserEmail,
        password: newUserPassword,
        email_confirm: true,
        user_metadata: {
          first_name: newUserFirstName,
          last_name: newUserLastName
        }
      });
      
      if (authError) throw authError;
      
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          company_id: companyId,
          is_company_admin: newUserIsAdmin,
          is_super_admin: false,
          first_name: newUserFirstName,
          last_name: newUserLastName
        })
        .eq('id', authData.user.id);
        
      if (profileError) throw profileError;
      
      toast.success("Usuário criado com sucesso");
      setUserDialogOpen(false);
      fetchUsers();
      
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserFirstName("");
      setNewUserLastName("");
      setNewUserCompany("");
      setNewUserIsAdmin(false);
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast.error(error.message || "Erro ao criar usuário");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async () => {
    setLoading(true);
    try {
      if (!newCompanyName.trim()) {
        throw new Error("O nome da empresa é obrigatório");
      }
      
      let companySlug = newCompanySlug || newCompanyName.toLowerCase().replace(/\s+/g, '-');
      
      if (!isSuperAdmin && !isEditorSuperAdmin) {
        throw new Error("Apenas administradores do sistema podem criar empresas");
      }
      
      let novaEmpresaId: string | null = null;
      
      if (isEditorSuperAdmin) {
        const sqlQuery = `
          INSERT INTO public.companies (
            name, 
            slug, 
            active,
            created_at
          ) VALUES (
            '${newCompanyName}',
            '${companySlug}',
            true,
            NOW()
          ) RETURNING *;
        `;
        
        const result = await executeQuery(sqlQuery);
        
        if (!result.success) {
          throw new Error(result.error || "Erro ao criar empresa");
        }
        
        if (result.data && result.data.length > 0) {
          novaEmpresaId = result.data[0].id;
          
          const verificacao = await verificarEmpresaSalva(novaEmpresaId);
          if (!verificacao.success) {
            console.error("Verificação de empresa falhou:", verificacao.error);
            throw new Error("A empresa foi criada mas não pôde ser verificada no banco de dados");
          } else {
            console.log("Empresa verificada com sucesso:", verificacao.company);
          }
        } else {
          throw new Error("Empresa criada mas nenhum ID retornado");
        }
        
        toast.success("Empresa criada com sucesso");
        setCompanyDialogOpen(false);
        await fetchCompanies();
        
        setNewCompanyName("");
        setNewCompanySlug("");
      } else {
        try {
          const { data, error } = await supabase
            .from('companies')
            .insert({
              name: newCompanyName,
              slug: companySlug,
              active: true,
              created_at: new Date().toISOString()
            })
            .select()
            .single();
            
          if (error) {
            console.error("Erro no Supabase ao criar empresa:", error);
            
            let errorMessage = "Erro ao criar empresa";
            if (error.message) {
              errorMessage = error.message;
            } else if (error.details) {
              errorMessage = error.details;
            } else if (typeof error === 'object') {
              errorMessage = JSON.stringify(error);
            }
            
            throw new Error(errorMessage);
          }
          
          if (data) {
            novaEmpresaId = data.id;
            console.log("Nova empresa criada:", data);
            toast.success("Empresa criada com sucesso");
          } else {
            throw new Error("Empresa criada mas nenhum dado retornado");
          }
          
          setCompanyDialogOpen(false);
          await fetchCompanies();
          
          setNewCompanyName("");
          setNewCompanySlug("");
        } catch (supabaseError: any) {
          console.error("Erro completo do Supabase:", supabaseError);
          throw supabaseError;
        }
      }
    } catch (error: any) {
      console.error("Erro detalhado ao criar empresa:", error);
      
      let errorMessage = "Erro ao criar empresa";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = error.message || error.details || JSON.stringify(error);
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async () => {
    setLoading(true);
    try {
      const companyId = isSuperAdmin ? newRoleCompany : (userCompany?.id || null);
      
      if (!companyId) {
        throw new Error("É necessário selecionar uma empresa");
      }
      
      if (isEditorSuperAdmin) {
        const sqlQuery = `
          INSERT INTO public.roles (
            name, 
            company_id, 
            is_default
          ) VALUES (
            '${newRoleName}',
            '${companyId}',
            ${newRoleIsDefault}
          ) RETURNING *;
        `;
        
        const result = await executeQuery(sqlQuery);
        
        if (!result.success) throw new Error(result.error);
        
        toast.success("Papel criado com sucesso");
        setRoleDialogOpen(false);
        fetchRoles();
        
        setNewRoleName("");
        setNewRoleCompany("");
        setNewRoleIsAdmin(false);
        setNewRoleIsDefault(false);
      } else {
        const { data, error } = await supabase
          .from('roles')
          .insert({
            name: newRoleName,
            company_id: companyId,
            is_default: newRoleIsDefault
          })
          .select()
          .single();
          
        if (error) throw error;
        
        toast.success("Papel criado com sucesso");
        setRoleDialogOpen(false);
        fetchRoles();
        
        setNewRoleName("");
        setNewRoleCompany("");
        setNewRoleIsAdmin(false);
        setNewRoleIsDefault(false);
      }
    } catch (error: any) {
      console.error("Error creating role:", error);
      toast.error(error.message || "Erro ao criar papel");
    } finally {
      setLoading(false);
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
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Empresas</CardTitle>
                        <CardDescription>Gerenciar empresas do sistema</CardDescription>
                      </div>
                      <Dialog open={companyDialogOpen} onOpenChange={setCompanyDialogOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nova Empresa
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Criar Nova Empresa</DialogTitle>
                            <DialogDescription>
                              Preencha os dados para criar uma nova empresa no sistema
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="companyName">Nome da Empresa</Label>
                              <Input
                                id="companyName"
                                placeholder="Nome da Empresa"
                                value={newCompanyName}
                                onChange={(e) => {
                                  setNewCompanyName(e.target.value);
                                  setNewCompanySlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="companySlug">Identificador Único (Slug)</Label>
                              <Input
                                id="companySlug"
                                placeholder="identificador-unico"
                                value={newCompanySlug}
                                onChange={(e) => setNewCompanySlug(e.target.value)}
                              />
                              <p className="text-sm text-muted-foreground">
                                O identificador único será usado para URLs e identificação da empresa.
                              </p>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setCompanyDialogOpen(false)}>Cancelar</Button>
                            <Button onClick={handleCreateCompany} disabled={loading}>
                              {loading ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Processando...
                                </>
                              ) : 'Criar Empresa'}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="flex justify-center items-center h-40">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          <span className="ml-2">Carregando...</span>
                        </div>
                      ) : (
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Identificador</TableHead>
                                <TableHead>Módulos Ativos</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[100px]">Ações</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {companies.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={5} className="h-24 text-center">
                                    Nenhuma empresa encontrada.
                                  </TableCell>
                                </TableRow>
                              ) : (
                                companies.map((company) => (
                                  <TableRow key={company.id}>
                                    <TableCell>
                                      <div className="flex items-center">
                                        <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                                        {company.name}
                                      </div>
                                    </TableCell>
                                    <TableCell>{company.slug}</TableCell>
                                    <TableCell>
                                      {(company.active_modules || []).length > 0 
                                        ? company.active_modules.join(', ') 
                                        : 'Todos'}
                                    </TableCell>
                                    <TableCell>
                                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                        company.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                      }`}>
                                        {company.active ? 'Ativa' : 'Inativa'}
                                      </span>
                                    </TableCell>
                                    <TableCell>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                          setItemToDelete({ id: company.id, type: 'company' });
                                          setDeleteDialogOpen(true);
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
              
              <TabsContent value="users" className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Usuários</CardTitle>
                      <CardDescription>
                        {isSuperAdmin 
                          ? "Gerenciar todos os usuários do sistema" 
                          : "Gerenciar usuários da sua empresa"}
                      </CardDescription>
                    </div>
                    <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Novo Usuário
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Criar Novo Usuário</DialogTitle>
                          <DialogDescription>
                            Preencha os dados para criar um novo usuário no sistema
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">Nome</Label>
                              <Input
                                id="firstName"
                                placeholder="Nome"
                                value={newUserFirstName}
                                onChange={(e) => setNewUserFirstName(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName">Sobrenome</Label>
                              <Input
                                id="lastName"
                                placeholder="Sobrenome"
                                value={newUserLastName}
                                onChange={(e) => setNewUserLastName(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              placeholder="usuario@empresa.com"
                              type="email"
                              value={newUserEmail}
                              onChange={(e) => setNewUserEmail(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                              id="password"
                              placeholder="Senha"
                              type="password"
                              value={newUserPassword}
                              onChange={(e) => setNewUserPassword(e.target.value)}
                            />
                          </div>
                          {isSuperAdmin && (
                            <div className="space-y-2">
                              <Label htmlFor="company">Empresa</Label>
                              <Select value={newUserCompany} onValueChange={setNewUserCompany}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione uma empresa" />
                                </SelectTrigger>
                                <SelectContent>
                                  {companies.map((company) => (
                                    <SelectItem key={company.id} value={company.id}>
                                      {company.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          <div className="space-y-2">
                            <Label htmlFor="isAdmin" className="flex items-center gap-2">
                              <input
                                id="isAdmin"
                                type="checkbox"
                                checked={newUserIsAdmin}
                                onChange={(e) => setNewUserIsAdmin(e.target.checked)}
                                className="h-4 w-4"
                              />
                              Administrador da Empresa
                            </Label>
                            <p className="text-xs text-muted-foreground ml-6">
                              Administradores de empresa podem gerenciar usuários e configurações da empresa.
                            </p>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setUserDialogOpen(false)}>Cancelar</Button>
                          <Button onClick={handleCreateUser} disabled={loading}>
                            {loading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processando...
                              </>
                            ) : 'Criar Usuário'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="ml-2">Carregando...</span>
                      </div>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nome</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Empresa</TableHead>
                              <TableHead>Função</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="w-[100px]">Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {users.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                  Nenhum usuário encontrado.
                                </TableCell>
                              </TableRow>
                            ) : (
                              users.map((user) => (
                                <TableRow key={user.id}>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <User className="h-4 w-4 text-muted-foreground" />
                                      {user.first_name} {user.last_name}
                                    </div>
                                  </TableCell>
                                  <TableCell>{user.email}</TableCell>
                                  <TableCell>{user.company_name || '-'}</TableCell>
                                  <TableCell>
                                    {user.is_super_admin 
                                      ? 'Super Admin' 
                                      : user.is_company_admin 
                                        ? 'Admin da Empresa' 
                                        : 'Usuário'}
                                  </TableCell>
                                  <TableCell>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                      user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                      {user.is_active ? 'Ativo' : 'Inativo'}
                                    </span>
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        setItemToDelete({ id: user.id, type: 'user' });
                                        setDeleteDialogOpen(true);
                                      }}
                                      disabled={user.is_super_admin && !isSuperAdmin}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="roles" className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Papéis</CardTitle>
                      <CardDescription>
                        {isSuperAdmin 
                          ? "Gerenciar papéis do sistema" 
                          : "Gerenciar papéis da sua empresa"}
                      </CardDescription>
                    </div>
                    <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Novo Papel
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Criar Novo Papel</DialogTitle>
                          <DialogDescription>
                            Preencha os dados para criar um novo papel no sistema
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="roleName">Nome do Papel</Label>
                            <Input
                              id="roleName"
                              placeholder="Nome do Papel"
                              value={newRoleName}
                              onChange={(e) => setNewRoleName(e.target.value)}
                            />
                          </div>
                          {isSuperAdmin && (
                            <div className="space-y-2">
                              <Label htmlFor="roleCompany">Empresa</Label>
                              <Select value={newRoleCompany} onValueChange={setNewRoleCompany}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione uma empresa" />
                                </SelectTrigger>
                                <SelectContent>
                                  {companies.map((company) => (
                                    <SelectItem key={company.id} value={company.id}>
                                      {company.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          <div className="space-y-2">
                            <Label htmlFor="isDefault" className="flex items-center gap-2">
                              <input
                                id="isDefault"
                                type="checkbox"
                                checked={newRoleIsDefault}
                                onChange={(e) => setNewRoleIsDefault(e.target.checked)}
                                className="h-4 w-4"
                              />
                              Papel Padrão
                            </Label>
                            <p className="text-xs text-muted-foreground ml-6">
                              O papel padrão é atribuído a novos usuários automaticamente.
                            </p>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>Cancelar</Button>
                          <Button onClick={handleCreateRole} disabled={loading}>
                            {loading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processando...
                              </>
                            ) : 'Criar Papel'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="ml-2">Carregando...</span>
                      </div>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nome</TableHead>
                              <TableHead>Empresa</TableHead>
                              <TableHead>Padrão</TableHead>
                              <TableHead className="w-[100px]">Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {roles.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                  Nenhum papel encontrado.
                                </TableCell>
                              </TableRow>
                            ) : (
                              roles.map((role) => (
                                <TableRow key={role.id}>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Shield className="h-4 w-4 text-muted-foreground" />
                                      {role.name}
                                    </div>
                                  </TableCell>
                                  <TableCell>{role.company_name || '-'}</TableCell>
                                  <TableCell>
                                    {role.is_default ? (
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        <CheckSquare className="h-3 w-3 mr-1" />
                                        Padrão
                                      </span>
                                    ) : '-'}
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        setItemToDelete({ id: role.id, type: 'role' });
                                        setDeleteDialogOpen(true);
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmação de exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                    {itemToDelete?.type === 'user' && "Esta ação não pode ser desfeita. O usuário será removido permanentemente do sistema."}
                    {itemToDelete?.type === 'company' && "Esta ação não pode ser desfeita. A empresa e todos os seus dados serão removidos permanentemente."}
                    {itemToDelete?.type === 'role' && "Esta ação não pode ser desfeita. O papel será removido permanentemente do sistema."}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteItem} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default Admin;
