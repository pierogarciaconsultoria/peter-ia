
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSecurity } from "./SecurityContext";
import { PermissionCheck, PermissionType } from "./SecurityTypes";
import { useAuth } from "@/hooks/useAuth";

// Flag para desabilitar temporariamente a autenticação
const BYPASS_AUTH_TEMPORARILY = true;

interface SecureRouteProps {
  children?: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireSuperAdmin?: boolean;
  requiredPermissions?: Array<PermissionCheck>;
  requireAllPermissions?: boolean;
  fallbackPath?: string;
}

export const SecureRoute: React.FC<SecureRouteProps> = ({
  children,
  requireAuth = true,
  requireAdmin = false,
  requireSuperAdmin = false,
  requiredPermissions = [],
  requireAllPermissions = true,
  fallbackPath = "/auth"
}) => {
  const location = useLocation();
  const { loading } = useAuth();
  const {
    isAuthenticated,
    isAdmin,
    isMaster,
    isLovableAdmin,
    isFreeAccessMode,
    checkPermission,
    checkMultiplePermissions,
    checkAnyPermission,
    logSecurityEvent
  } = useSecurity();

  // Show loading indicator while authentication state is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Carregando...</span>
      </div>
    );
  }

  // Temporarily bypass authentication
  if (BYPASS_AUTH_TEMPORARILY) {
    console.log("Autenticação temporariamente desabilitada - acesso concedido");
    logSecurityEvent({
      action: 'ACCESS_GRANTED',
      targetResource: location.pathname,
      details: { reason: 'Authentication temporarily disabled' },
      status: 'success'
    });
    return children ? <>{children}</> : <Outlet />;
  }

  // Special case: Lovable Editor or Free Access mode bypass all restrictions
  if (isLovableAdmin || isFreeAccessMode) {
    return children ? <>{children}</> : <Outlet />;
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    logSecurityEvent({
      action: 'ACCESS_DENIED',
      targetResource: location.pathname,
      details: { reason: 'Not authenticated' },
      status: 'denied'
    });
    
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check Super Admin requirement
  if (requireSuperAdmin && !isMaster) {
    logSecurityEvent({
      action: 'ACCESS_DENIED',
      targetResource: location.pathname,
      details: { reason: 'Super Admin required' },
      status: 'denied'
    });
    
    return <Navigate to="/" replace />;
  }

  // Check Admin requirement
  if (requireAdmin && !isAdmin && !isMaster) {
    logSecurityEvent({
      action: 'ACCESS_DENIED',
      targetResource: location.pathname,
      details: { reason: 'Admin required' },
      status: 'denied'
    });
    
    return <Navigate to="/" replace />;
  }

  // Check specific permissions if required
  if (requiredPermissions.length > 0) {
    const hasPermission = requireAllPermissions
      ? checkMultiplePermissions(requiredPermissions)
      : checkAnyPermission(requiredPermissions);

    if (!hasPermission) {
      logSecurityEvent({
        action: 'ACCESS_DENIED',
        targetResource: location.pathname,
        details: { 
          reason: 'Required permissions not granted',
          requiredPermissions 
        },
        status: 'denied'
      });
      
      return <Navigate to="/" replace />;
    }
  }

  // Log successful access
  logSecurityEvent({
    action: 'ACCESS_GRANTED',
    targetResource: location.pathname,
    status: 'success'
  });

  // All checks passed, grant access
  return children ? <>{children}</> : <Outlet />;
};
