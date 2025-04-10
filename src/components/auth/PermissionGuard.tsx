
import React from "react";
import { useUserPermissions } from "@/hooks/useUserPermissions";

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
  const { temPermissao, isLoading } = useUserPermissions();
  
  if (isLoading) {
    // Opcional: mostrar indicador de carregamento
    return null;
  }
  
  if (!temPermissao(modulo, requerPermissao)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};
