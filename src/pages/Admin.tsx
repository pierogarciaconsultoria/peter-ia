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
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: 'user' | 'company'} | null>(null);
  
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserFirstName, setNewUserFirstName] = useState("");
  const [newUserLastName, setNewUserLastName] = useState("");
  const [newUserCompany, setNewUserCompany] = useState("");
  const [newUserIsAdmin, setNewUserIsAdmin] = useState(false);
  
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanySlug, setNewCompanySlug] = useState("");

  useEffect(() => {
    fetchCompanies();
    fetchUsers();
    fetchRoles();
  }, [isSuperAdmin, isCompanyAdmin, userCompany]);

  const fetchCompanies = async () => {
    try {
      let query = supabase.from('companies').select('*');
      
      if (!isSuperAdmin && userCompany) {
        query = query.eq('id', userCompany.id);
      }
      
      const { data, error } = await query.order('name');
        
      if (error) throw error;
      
      setCompanies(data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast.error("Erro ao carregar empresas");
      setLoading(false);
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
        
      if (error) throw error;
      
      const formattedUsers = data?.map(user => ({
        ...user,
        company_name: user.companies?.name
      }));
      
      setUsers(formattedUsers || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Erro ao carregar usuários");
      setLoading(false);
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
        
      if (error) throw error;
      
      const formattedRoles = (data || []).map(role => {
        const typedRole: Role = {
          ...role as any,
          company_name: role.companies?.name,
          is_admin: false
        };
        
        return typedRole;
      });
      
      setRoles(formattedRoles);
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Erro ao carregar papéis");
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
      if (!isSuperAdmin) {
        throw new Error("Apenas administradores do sistema podem criar empresas");
      }
      
      const { data, error } = await supabase
        .from('companies')
        .insert({
          name: newCompanyName,
          slug: newCompanySlug || newCompanyName.toLowerCase().replace(/\s+/g, '-'),
          active: true
        })
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success("Empresa criada com sucesso");
      setCompanyDialogOpen(false);
      fetchCompanies();
      
      setNewCompanyName("");
      setNewCompanySlug("");
    } catch (error: any) {
      console.error("Error creating company:", error);
      toast.error(error.message || "Erro ao criar empresa");
    } finally {
      setLoading(false);
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
      }
      
      toast.success(`${itemToDelete.type === 'user' ? 'Usuário' : 'Empresa'} excluído(a) com sucesso`);
    } catch (error: any) {
      console.error(`Error deleting ${itemToDelete.type}:`, error);
      toast.error(error.message || `Erro ao excluir ${itemToDelete.type === 'user' ? 'usuário' : 'empresa'}`);
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
                  <CardHeader>
                    <CardTitle>Papéis e Permissões</CardTitle>
                    <CardDescription>Gerenciar papéis e permissões de usuários</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">Super Admin</h3>
                          <p className="text-sm text-muted-foreground">
                            Acesso total ao sistema e todas as empresas.
                          </p>
                        </div>
                        <CheckSquare className="h-5 w-5 text-primary" />
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">Administrador de Empresa</h3>
                          <p className="text-sm text-muted-foreground">
                            Gerencia usuários e configurações da sua empresa.
                          </p>
                        </div>
                        <CheckSquare className="h-5 w-5 text-primary" />
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">Usuário</h3>
                          <p className="text-sm text-muted-foreground">
                            Acesso apenas às funcionalidades permitidas dentro da sua empresa.
                          </p>
                        </div>
                        <CheckSquare className="h-5 w-5 text-primary" />
                      </div>
                      
                      <div className="mt-4 text-center">
                        <p className="text-sm text-muted-foreground">
                          Funcionalidades avançadas de gerenciamento de papéis e permissões estão em desenvolvimento.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
        
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza de que deseja excluir este {itemToDelete?.type === 'user' ? 'usuário' : 'empresa'}?
                {itemToDelete?.type === 'company' && (
                  <span className="block mt-2 font-bold text-destructive">
                    Atenção: Esta ação também excluirá todos os usuários e dados associados à empresa.
                  </span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteItem} className="bg-destructive text-destructive-foreground">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : 'Excluir'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AuthGuard>
  );
};

export default Admin;
