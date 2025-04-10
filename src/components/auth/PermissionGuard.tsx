
import React from "react";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface PermissionGuardProps {
  children: React.ReactNode;
  modulo: string;
  requerPermissao?: 'visualizar' | 'editar' | 'excluir' | 'criar';
  fallback?: React.ReactNode;
}

export const PermissionGuard = ({
  children,
  modulo,
  requerPermissao = 'visualizar',
  fallback = null
}: PermissionGuardProps) => {
  const { isMaster } = useCurrentUser();
  const { temPermissao, isLoading } = useUserPermissions();
  
  // Se estiver carregando, não mostra nada ou pode mostrar um loader
  if (isLoading) {
    return null;
  }
  
  // Usuários master têm acesso irrestrito a todos os módulos
  if (isMaster) {
    return <>{children}</>;
  }
  
  // Para usuários não-master, verifica as permissões específicas
  if (!temPermissao(modulo, requerPermissao)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};
