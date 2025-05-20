
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { shouldBypassAuth } from "@/utils/lovableEditorDetection";
import { toast } from "sonner";

interface AuthGuardProps {
  children?: React.ReactNode;
  requireAdmin?: boolean;
  requireSuperAdmin?: boolean;
  bypassForMasterAdmin?: boolean;
}

export const AuthGuard = ({ 
  children,
  requireAdmin = false,
  requireSuperAdmin = false,
  bypassForMasterAdmin = true
}: AuthGuardProps) => {
  const { user, loading, isAdmin, isSuperAdmin } = useAuth();
  const location = useLocation();

  // Verificar se devemos permitir acesso sem autenticação
  const bypassAuth = shouldBypassAuth();
  
  useEffect(() => {
    // Notificação para acesso especial
    if (bypassAuth && sessionStorage.getItem('specialAccessNotified') !== 'true') {
      toast.info("Acesso especial concedido", {
        description: "Autenticação ignorada devido ao modo de desenvolvimento ou acesso especial"
      });
      sessionStorage.setItem('specialAccessNotified', 'true');
    }
  }, [bypassAuth]);

  // Exibir indicador de carregamento se estiver carregando
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Carregando...</span>
      </div>
    );
  }

  // Permitir acesso se o bypass está habilitado
  if (bypassAuth && bypassForMasterAdmin) {
    console.log("Acesso garantido via bypass de autenticação");
    return children ? <>{children}</> : <Outlet />;
  }

  // Verificar autenticação
  if (!user) {
    // Registrar tentativa de acesso não autorizada
    console.log("Acesso negado: usuário não autenticado");
    
    // Redirect to login page but save the location they tried to access
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Verificar permissões específicas
  if (requireSuperAdmin && !isSuperAdmin) {
    console.log("Acesso negado: permissão de super admin requerida");
    // Redirect to dashboard if super admin access is required but user is not a super admin
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !isAdmin) {
    console.log("Acesso negado: permissão de admin requerida");
    // Redirect to dashboard if admin access is required but user is not an admin
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has required permissions
  return children ? <>{children}</> : <Outlet />;
};

export default AuthGuard;
