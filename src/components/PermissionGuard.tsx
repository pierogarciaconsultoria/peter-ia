
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { isSuperAdminInLovable } from "@/utils/lovableEditorDetection";
import { useUserPermissions } from "@/hooks/useUserPermissions";

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
  modulo?: string;
  requerPermissao?: 'visualizar' | 'editar' | 'excluir' | 'criar';
  fallback?: React.ReactNode;
  showLoader?: boolean;
}

export const PermissionGuard = ({ 
  children, 
  requiredRole = "admin", 
  modulo, 
  requerPermissao = 'visualizar',
  fallback = null,
  showLoader = false
}: PermissionGuardProps) => {
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const location = useLocation();
  const { temPermissao, isLoading } = useUserPermissions();
  
  // Detecta se é um super admin no Lovable Editor
  const isMasterLovable = isSuperAdminInLovable();
  
  // Super Admin no Lovable Editor tem acesso irrestrito a tudo
  if (isMasterLovable) {
    console.log(`Acesso concedido via Lovable Editor`);
    return <>{children}</>;
  }
  
  // Se estiver carregando e showLoader for true, mostra o loader
  if (isLoading && showLoader) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
        <span className="text-sm text-muted-foreground">Verificando permissões...</span>
      </div>
    );
  }

  // Verificações por tipo de permissão
  
  // 1. Verificação por role (admin/superadmin)
  if (requiredRole) {
    // Usuários super admin têm acesso a todos os módulos
    if (isSuperAdmin) {
      return <>{children}</>;
    }
    
    // Para os demais, verificamos a role específica
    if (requiredRole === "admin" && !isAdmin) {
      console.log("Acesso negado: usuário não tem permissão de administrador");
      return fallback || <Navigate to="/" replace />;
    }
  }
  
  // 2. Verificação por módulo específico
  if (modulo) {
    // Usuários master e admin têm acesso a tudo
    if (isSuperAdmin || isAdmin) {
      return <>{children}</>;
    }
    
    // Para usuários comuns, verifica as permissões específicas
    if (!temPermissao(modulo, requerPermissao)) {
      console.log(`Acesso negado: usuário não tem permissão '${requerPermissao}' para módulo '${modulo}'`);
      return fallback || <Navigate to="/" replace />;
    }
  }
  
  // Se chegou até aqui, o usuário tem permissão
  return <>{children}</>;
};

export default PermissionGuard;
