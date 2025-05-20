
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { shouldBypassAuth, isProductionEnvironment } from "@/utils/lovableEditorDetection";
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
  const { user, loading, isAdmin, isSuperAdmin, connectionStatus, reconnect } = useAuth();
  const location = useLocation();
  
  // Check if we should bypass auth (more restricted in production)
  const bypassAuth = shouldBypassAuth();
  
  useEffect(() => {
    // Only show special access notification in development
    if (bypassAuth && !isProductionEnvironment() && sessionStorage.getItem('specialAccessNotified') !== 'true') {
      toast.info("Acesso especial concedido", {
        description: "Autenticação ignorada devido ao modo de desenvolvimento ou acesso especial"
      });
      sessionStorage.setItem('specialAccessNotified', 'true');
    }
    
    // In disconnected state, try to reconnect
    if (connectionStatus === 'disconnected') {
      const reconnectTimer = setTimeout(() => {
        reconnect();
      }, 5000);
      
      return () => clearTimeout(reconnectTimer);
    }
  }, [bypassAuth, connectionStatus, reconnect]);

  // Show loading indicator when checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Carregando...</span>
      </div>
    );
  }
  
  // Handle connection issues
  if (connectionStatus === 'disconnected' && !bypassAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <h2 className="text-lg font-semibold text-red-700 mb-2">Problema de conexão</h2>
          <p className="text-red-600 mb-4">Não foi possível conectar ao servidor. Verifique sua conexão com a internet.</p>
          <button 
            onClick={() => reconnect()}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // Bypass authentication if allowed (more restricted in production)
  if (bypassAuth && bypassForMasterAdmin) {
    console.log("Acesso garantido via bypass de autenticação");
    return children ? <>{children}</> : <Outlet />;
  }

  // Check authentication
  if (!user) {
    console.log("Acesso negado: usuário não autenticado");
    
    // Redirect to login page but save the location they tried to access
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check super admin permissions
  if (requireSuperAdmin && !isSuperAdmin) {
    console.log("Acesso negado: permissão de super admin requerida");
    toast.error("Acesso negado", {
      description: "Você não tem permissão para acessar esta área."
    });
    return <Navigate to="/" replace />;
  }

  // Check admin permissions
  if (requireAdmin && !isAdmin && !isSuperAdmin) {
    console.log("Acesso negado: permissão de admin requerida");
    toast.error("Acesso negado", {
      description: "Você não tem permissão para acessar esta área."
    });
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has required permissions
  return children ? <>{children}</> : <Outlet />;
};

export default AuthGuard;
