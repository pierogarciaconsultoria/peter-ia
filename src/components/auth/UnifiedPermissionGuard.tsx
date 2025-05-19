
import React from "react";
import { useSecurity } from "@/security/SecurityContext";
import { PermissionType } from "@/security/SecurityTypes";
import { Loader2 } from "lucide-react";
import { useUserPermissions } from "@/hooks/useUserPermissions";

interface UnifiedPermissionGuardProps {
  children: React.ReactNode;
  modulo: string;
  requerPermissao?: PermissionType;
  fallback?: React.ReactNode;
  showLoader?: boolean;
}

export const UnifiedPermissionGuard = ({
  children,
  modulo,
  requerPermissao = 'visualizar',
  fallback = null,
  showLoader = false
}: UnifiedPermissionGuardProps) => {
  const { isLovableAdmin, isMaster, isAdmin, isFreeAccessMode } = useSecurity();
  const { temPermissao, isLoading } = useUserPermissions();

  // Se estiver carregando, mostra o loader se configurado ou não mostra nada
  if (isLoading) {
    return showLoader ? (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
        <span className="text-sm text-muted-foreground">Verificando permissões...</span>
      </div>
    ) : null;
  }

  // Verificação hierárquica de permissões - do maior para o menor nível
  // 0. Super Admin no Lovable Editor ou Free Access tem acesso irrestrito a tudo
  if (isLovableAdmin || isFreeAccessMode) {
    return <>{children}</>;
  }

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
    return <>{fallback}</>;
  }

  // Se chegou até aqui, o usuário tem permissão
  return <>{children}</>;
};
