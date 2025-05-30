
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Wifi, WifiOff } from "lucide-react";
import { shouldBypassAuth, isProductionEnvironment } from "@/utils/lovableEditorDetection";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  const { 
    user, 
    loading, 
    isAdmin, 
    isSuperAdmin, 
    connectionStatus, 
    reconnect, 
    hasAuthError, 
    clearAuthError 
  } = useAuth();
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
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <span className="text-lg">Carregando...</span>
          <p className="text-sm text-muted-foreground mt-2">
            Verificando autenticação
          </p>
        </div>
      </div>
    );
  }

  // Handle auth errors
  if (hasAuthError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <WifiOff className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-700">Erro de Autenticação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-center">
              Houve um problema com a autenticação. Tente novamente ou faça login.
            </p>
            <div className="space-y-2">
              <Button 
                onClick={() => {
                  clearAuthError();
                  reconnect();
                }}
                className="w-full"
              >
                <Wifi className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
              <Button 
                onClick={() => window.location.href = '/auth'}
                variant="outline"
                className="w-full"
              >
                Fazer Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Handle connection issues
  if (connectionStatus === 'disconnected' && !bypassAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <WifiOff className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-700">Problema de conexão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-center">
              Não foi possível conectar ao servidor. Verifique sua conexão com a internet.
            </p>
            <Button 
              onClick={() => reconnect()}
              className="w-full"
              variant="destructive"
            >
              <Wifi className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
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
