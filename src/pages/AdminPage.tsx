
import { useState } from "react";
import { Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Importar componentes administrativos
import UserManagement from "@/components/admin/UserManagement";
import RoleManagement from "@/components/admin/RoleManagement";
import CompanyManagement from "@/components/admin/CompanyManagement";
import { PermissoesUsuarios } from "@/components/admin/PermissoesUsuarios";
import { DatabaseConnectionStatus } from "@/components/admin/DatabaseConnectionStatus";

export default function AdminPage() {
  return (
    <div className="container py-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center mb-6">
        <Settings className="mr-2 h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Administração do Sistema</h1>
      </div>
      
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="roles">Perfis</TabsTrigger>
          <TabsTrigger value="permissions">Permissões</TabsTrigger>
          <TabsTrigger value="companies">Empresas</TabsTrigger>
          <TabsTrigger value="database">Banco de Dados</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="pt-6">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="roles" className="pt-6">
          <RoleManagement />
        </TabsContent>
        
        <TabsContent value="permissions" className="pt-6">
          <PermissoesUsuarios />
        </TabsContent>
        
        <TabsContent value="companies" className="pt-6">
          <CompanyManagement />
        </TabsContent>
        
        <TabsContent value="database" className="pt-6">
          <DatabaseConnectionStatus />
        </TabsContent>
      </Tabs>
    </div>
  );
}
