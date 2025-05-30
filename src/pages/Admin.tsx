
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CompanyManagement } from '@/components/admin/CompanyManagement';
import { UserManagement } from '@/components/admin/UserManagement';
import { RoleManagement } from '@/components/admin/RoleManagement';
import { PermissoesUsuarios } from '@/components/admin/PermissoesUsuarios';
import { CentralizedRegistration } from '@/components/admin/CentralizedRegistration';
import { DatabaseConnectionStatus } from '@/components/admin/DatabaseConnectionStatus';
import { ModuleAssistantSettings } from '@/components/admin/ModuleAssistantSettings';
import { PerformanceDashboard } from '@/components/admin/PerformanceDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Users, Building2, Settings, Database, Bot, Gauge, UserCog } from 'lucide-react';

const Admin = () => {
  const { isSuperAdmin, isCompanyAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('users');

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
          <UserManagement />
        </TabsContent>

        {isSuperAdmin && (
          <TabsContent value="companies" className="space-y-6">
            <CompanyManagement />
          </TabsContent>
        )}

        <TabsContent value="roles" className="space-y-6">
          <RoleManagement />
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <PermissoesUsuarios />
        </TabsContent>

        {isSuperAdmin && (
          <TabsContent value="registration" className="space-y-6">
            <CentralizedRegistration />
          </TabsContent>
        )}

        <TabsContent value="database" className="space-y-6">
          <DatabaseConnectionStatus />
        </TabsContent>

        <TabsContent value="assistants" className="space-y-6">
          <ModuleAssistantSettings />
        </TabsContent>

        {isSuperAdmin && (
          <TabsContent value="performance" className="space-y-6">
            <PerformanceDashboard />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Admin;
