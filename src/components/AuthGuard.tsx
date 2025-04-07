
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
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
  const { user, isLoading, isAdmin, isSuperAdmin } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  // Enhanced Lovable editor detection
  // This check allows anyone editing in Lovable to bypass authentication entirely
  const isLovableEditor = 
    window.location.search.includes('master_admin=true') || 
    (process.env.NODE_ENV === 'development' && window.self !== window.top) ||
    window.location.hostname.includes('lovable.app');

  useEffect(() => {
    // Short delay to prevent flash of redirect
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [user]);

  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Carregando...</span>
      </div>
    );
  }

  // Special bypass for Lovable editing - always return children directly
  // This completely bypasses all authentication for Lovable editors
  if (isLovableEditor) {
    console.log("Acesso total concedido via Lovable editor - autenticação ignorada");
    return <>{children}</>;
  }

  if (!user) {
    // Redirect to login page but save the location they tried to access
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requireSuperAdmin && !isSuperAdmin) {
    // Redirect to dashboard if super admin access is required but user is not a super admin
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !isAdmin) {
    // Redirect to dashboard if admin access is required but user is not an admin
    return <Navigate to="/" replace />;
  }

  // User is authenticated (and has required permissions if specified)
  return <>{children}</>;
};
