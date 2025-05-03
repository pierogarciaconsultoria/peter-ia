
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { isSuperAdminInLovable } from "@/utils/lovableEditorDetection";

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const PermissionGuard = ({ children, requiredRole = "admin" }: PermissionGuardProps) => {
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const location = useLocation();
  
  // Detecta se é um super admin no Lovable Editor
  const isMasterLovable = isSuperAdminInLovable();
  
  // Super Admin no Lovable Editor tem acesso irrestrito a tudo
  if (isMasterLovable) {
    console.log(`Acesso concedido ao módulo administrativo via Lovable Editor`);
    return <>{children}</>;
  }
  
  // Usuários super admin têm acesso a todos os módulos
  if (isSuperAdmin) {
    return <>{children}</>;
  }
  
  // Para os demais, verificamos a role específica
  if (requiredRole === "admin" && !isAdmin) {
    // Redirect to dashboard if admin access is required but user is not an admin
    console.log("Acesso negado: usuário não tem permissão de administrador");
    return <Navigate to="/" replace />;
  }
  
  // Se chegou até aqui, o usuário tem permissão
  return <>{children}</>;
};

export default PermissionGuard;
