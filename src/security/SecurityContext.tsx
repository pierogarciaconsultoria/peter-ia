
import React, { createContext, useContext, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { shouldBypassAuth } from "@/utils/lovableEditorDetection";
import { supabase } from "@/integrations/supabase/client";
import { PermissionCheck, SecurityAuditLogEntry, SecurityContextType } from "./SecurityTypes";
import { toast } from "sonner";

// Create security context
const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export interface SecurityProviderProps {
  children: React.ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const { temPermissao } = useUserPermissions();
  
  // Verificar se devemos permitir acesso sem autenticação
  const bypassAuth = shouldBypassAuth();
  
  // Determine if user is authenticated based on actual user or bypass
  const isAuthenticated = useMemo(() => {
    return Boolean(user) || bypassAuth;
  }, [user, bypassAuth]);

  // Permission checking functions
  const checkPermission = (module: string, permission: PermissionType): boolean => {
    // Special bypass cases
    if (bypassAuth) return true;
    if (isSuperAdmin) return true;
    if (isAdmin) return true;
    
    // Check specific permission
    return temPermissao(module, permission);
  };
  
  const checkMultiplePermissions = (checks: PermissionCheck[]): boolean => {
    // Special bypass cases
    if (bypassAuth) return true;
    if (isSuperAdmin) return true;
    if (isAdmin) return true;
    
    // All permissions must be granted
    return checks.every(check => temPermissao(check.module, check.permission));
  };
  
  const checkAnyPermission = (checks: PermissionCheck[]): boolean => {
    // Special bypass cases
    if (bypassAuth) return true;
    if (isSuperAdmin) return true;
    if (isAdmin) return true;
    
    // At least one permission must be granted
    return checks.some(check => temPermissao(check.module, check.permission));
  };
  
  // Security audit logging
  const logSecurityEvent = async (entry: Omit<SecurityAuditLogEntry, 'timestamp'>): Promise<void> => {
    try {
      const logEntry = {
        ...entry,
        userId: user?.id || 'anonymous',
        timestamp: new Date(),
        ipAddress: window.sessionStorage.getItem('client_ip') || undefined
      };
      
      // Log to console for development
      console.log('Security event:', logEntry);
      
      // Store in database if in production
      if (process.env.NODE_ENV === 'production') {
        // Use our custom RPC function to handle type issues
        const { error } = await supabase
          .rpc('log_security_event', {
            action_text: entry.action,
            user_id_text: user?.id || 'anonymous',
            target_resource_text: entry.targetResource || null,
            details_json: entry.details || {},
            status_text: entry.status,
            ip_address_text: window.sessionStorage.getItem('client_ip') || null
          });
          
        if (error) {
          console.error('Failed to log security event:', error);
        }
      }
    } catch (error) {
      console.error('Error logging security event:', error);
    }
  };
  
  // Create security context value
  const securityContextValue = useMemo(() => ({
    isAuthenticated,
    isAdmin,
    isMaster: isSuperAdmin,
    isLovableAdmin: bypassAuth,
    isFreeAccessMode: bypassAuth,
    checkPermission,
    checkMultiplePermissions,
    checkAnyPermission,
    logSecurityEvent
  }), [isAuthenticated, isAdmin, isSuperAdmin, bypassAuth]);

  return (
    <SecurityContext.Provider value={securityContextValue}>
      {children}
    </SecurityContext.Provider>
  );
};

// Custom hook for accessing security context
export const useSecurity = (): SecurityContextType => {
  const context = useContext(SecurityContext);
  
  if (!context) {
    throw new Error("useSecurity must be used within a SecurityProvider");
  }
  
  return context;
};
