
import React from "react";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface PermissionGuardProps {
  children: React.ReactNode;
  modulo: string;
  requerPermissao?: 'visualizar' | 'editar' | 'excluir' | 'criar';
  fallback?: React.ReactNode;
  showLoader?: boolean;
}

export const PermissionGuard = ({
  children,
  modulo,
  requerPermissao = 'visualizar',
  fallback = null,
  showLoader = false
}: PermissionGuardProps) => {
  const { isMaster, isAdmin } = useCurrentUser();
  const { temPermissao, isLoading } = useUserPermissions();
  
  // Se estiver carregando, mostra o loader se configurado ou não mostra nada
  if (isLoading) {
    return showLoader ? (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
        <span className="text-sm text-muted-foreground">Verificando permissões...</span>
      </div>
    ) : null;
  }
  
  // Verificação hierárquica de permissões - do maior para o menor nível
  // 1. Usuários master têm acesso irrestrito a todos os módulos
  if (isMaster) {
    return <>{children}</>;
  }
  
  // 2. Administradores têm acesso a tudo dentro de sua empresa
  if (isAdmin) {
    return <>{children}</>;
  }
  
  // 3. Para usuários comuns, verifica as permissões específicas
  if (!temPermissao(modulo, requerPermissao)) {
    console.log(`Acesso negado: usuário não tem permissão '${requerPermissao}' para módulo '${modulo}'`);
    return <>{fallback}</>;
  }
  
  // Se chegou até aqui, o usuário tem permissão
  return <>{children}</>;
};
