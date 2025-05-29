
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Shield, Info } from "lucide-react";
import CompanyManagement from "./CompanyManagement";
import UserManagement from "./UserManagement";
import RoleManagement from "./RoleManagement";
import { PermissoesUsuarios } from "./PermissoesUsuarios";

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

interface CentralizedRegistrationProps {
  companies: Company[];
  users: UserProfile[];
  roles: Role[];
  loading: boolean;
  fetchCompanies: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchRoles: () => Promise<void>;
  setItemToDelete: (item: {id: string, type: 'user' | 'company' | 'role'}) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  isSuperAdmin: boolean;
  userCompany: Company | null;
}

const CentralizedRegistration: React.FC<CentralizedRegistrationProps> = ({
  companies,
  users,
  roles,
  loading,
  fetchCompanies,
  fetchUsers,
  fetchRoles,
  setItemToDelete,
  setDeleteDialogOpen,
  isSuperAdmin,
  userCompany
}) => {
  const [activeSubTab, setActiveSubTab] = useState(isSuperAdmin ? "empresas" : "usuarios");

  return (
    <div className="space-y-6">
      {/* Header com informações sobre o fluxo de cadastro */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            Central de Cadastros
          </CardTitle>
          <CardDescription>
            {isSuperAdmin ? (
              "Gerencie todos os cadastros do sistema. Fluxo recomendado: Empresas → Usuários → Papéis e Permissões"
            ) : (
              "Gerencie os cadastros da sua empresa. Fluxo recomendado: Usuários → Papéis e Permissões"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant={isSuperAdmin ? "default" : "secondary"}>
                <Building2 className="h-3 w-3 mr-1" />
                {companies.length} Empresa{companies.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                <Users className="h-3 w-3 mr-1" />
                {users.length} Usuário{users.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                <Shield className="h-3 w-3 mr-1" />
                {roles.length} Papel{roles.length !== 1 ? 'is' : ''}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs para os diferentes tipos de cadastro */}
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="grid w-full grid-cols-4">
          {isSuperAdmin && (
            <TabsTrigger value="empresas" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Empresas
            </TabsTrigger>
          )}
          <TabsTrigger value="usuarios" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="papeis" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Papéis
          </TabsTrigger>
          <TabsTrigger value="permissoes" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Permissões
          </TabsTrigger>
        </TabsList>

        {isSuperAdmin && (
          <TabsContent value="empresas" className="mt-6">
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

        <TabsContent value="usuarios" className="mt-6">
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

        <TabsContent value="papeis" className="mt-6">
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

        <TabsContent value="permissoes" className="mt-6">
          <PermissoesUsuarios />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CentralizedRegistration;
