
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Database, Bot, Gauge, UserCog, Settings } from "lucide-react";
import RoleManagement from "./RoleManagement";
import CentralizedRegistration from "./CentralizedRegistration";
import { DatabaseConnectionStatus } from "./DatabaseConnectionStatus";
import { ModuleAssistantSettings } from "./ModuleAssistantSettings";
import { PerformanceDashboard } from "./PerformanceDashboard";

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

interface AdminAdvancedSettingsProps {
  roles: Role[];
  companies: Company[];
  users: UserProfile[];
  loading: boolean;
  fetchRoles: () => Promise<void>;
  fetchCompanies: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  setItemToDelete: (item: {id: string, type: 'user' | 'company' | 'role'}) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  isSuperAdmin: boolean;
  userCompany: Company | null;
}

export function AdminAdvancedSettings({
  roles,
  companies,
  users,
  loading,
  fetchRoles,
  fetchCompanies,
  fetchUsers,
  setItemToDelete,
  setDeleteDialogOpen,
  isSuperAdmin,
  userCompany
}: AdminAdvancedSettingsProps) {
  const [activeSubTab, setActiveSubTab] = useState("roles");

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-500" />
            Configurações Avançadas
          </CardTitle>
          <CardDescription>
            Configurações de sistema, banco de dados e funcionalidades avançadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                <UserCog className="h-3 w-3 mr-1" />
                {roles.length} Papel{roles.length !== 1 ? 'is' : ''}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                <Database className="h-3 w-3 mr-1" />
                Sistema de Banco
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                <Bot className="h-3 w-3 mr-1" />
                Assistentes IA
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings Tabs */}
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            <span className="hidden sm:inline">Roles</span>
          </TabsTrigger>
          
          <TabsTrigger value="cadastros" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Cadastros</span>
          </TabsTrigger>
          
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Database</span>
          </TabsTrigger>
          
          <TabsTrigger value="assistentes" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            <span className="hidden sm:inline">Assistentes</span>
          </TabsTrigger>

          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Gauge className="h-4 w-4" />
            <span className="hidden sm:inline">Performance</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="mt-6">
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

        <TabsContent value="cadastros" className="mt-6">
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

        <TabsContent value="database" className="mt-6">
          <DatabaseConnectionStatus />
        </TabsContent>

        <TabsContent value="assistentes" className="mt-6">
          <ModuleAssistantSettings isAdmin={isSuperAdmin} />
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <PerformanceDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
