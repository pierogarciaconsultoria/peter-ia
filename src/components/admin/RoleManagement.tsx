
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { isSuperAdminInLovable } from "@/utils/lovableEditorDetection";
import { executeQuery } from "@/utils/databaseHelpers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckSquare, Loader2, Plus, Shield, Trash2 } from "lucide-react";

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

interface Company {
  id: string;
  name: string;
}

interface RoleManagementProps {
  roles: Role[];
  companies: Company[];
  loading: boolean;
  fetchRoles: () => Promise<void>;
  setItemToDelete: (item: {id: string, type: 'user' | 'company' | 'role'}) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  isSuperAdmin: boolean;
  userCompany: Company | null;
}

const RoleManagement: React.FC<RoleManagementProps> = ({
  roles,
  companies,
  loading,
  fetchRoles,
  setItemToDelete,
  setDeleteDialogOpen,
  isSuperAdmin,
  userCompany
}) => {
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleCompany, setNewRoleCompany] = useState("");
  const [newRoleIsAdmin, setNewRoleIsAdmin] = useState(false);
  const [newRoleIsDefault, setNewRoleIsDefault] = useState(false);
  const [creatingRole, setCreatingRole] = useState(false);
  
  const isEditorSuperAdmin = isSuperAdminInLovable();

  const handleCreateRole = async () => {
    setCreatingRole(true);
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
      setCreatingRole(false);
    }
  };

  return (
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
              <Button onClick={handleCreateRole} disabled={creatingRole}>
                {creatingRole ? (
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
  );
};

export default RoleManagement;
