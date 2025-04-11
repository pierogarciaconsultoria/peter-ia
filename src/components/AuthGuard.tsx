
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { shouldGrantFreeAccess, isSuperAdminInLovable } from "@/utils/lovableEditorDetection";
import { toast } from "sonner";

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
  // AND automatically grants them super admin privileges
  const isEditorSuperAdmin = isSuperAdminInLovable();
  
  // Verifica se o acesso gratuito está habilitado
  const isFreeAccessEnabled = shouldGrantFreeAccess();

  useEffect(() => {
    // Log access for debugging
    if (isEditorSuperAdmin) {
      console.log(`Acesso à rota ${location.pathname} concedido via Lovable editor com privilégios de super admin`);
      
      // Show toast for first access only
      if (sessionStorage.getItem('lovableEditorAccessNotified') !== 'true') {
        toast.success("Acesso total como super administrador concedido via Lovable Editor");
        sessionStorage.setItem('lovableEditorAccessNotified', 'true');
      }
    }
    
    // Special notification for free access mode
    if (isFreeAccessEnabled && sessionStorage.getItem('freeAccessNotified') !== 'true') {
      toast.success("Acesso gratuito para testes concedido automaticamente");
      sessionStorage.setItem('freeAccessNotified', 'true');
    }
    
    // Short delay to prevent flash of redirect
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [user, location.pathname, isEditorSuperAdmin, isFreeAccessEnabled]);

  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Carregando...</span>
      </div>
    );
  }

  // Acesso gratuito para testes: sempre concede acesso
  if (isFreeAccessEnabled) {
    console.log("Acesso gratuito para testes concedido - autenticação ignorada");
    return <>{children}</>;
  }

  // Special bypass for Lovable editing - always return children directly
  // This completely bypasses all authentication for Lovable editors
  // and grants them super admin privileges
  if (isEditorSuperAdmin) {
    console.log("Acesso total como super administrador concedido via Lovable editor - autenticação ignorada");
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
