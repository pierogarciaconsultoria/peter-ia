
import { useSecurity } from "./SecurityContext";
import { PermissionCheck, PermissionType } from "./SecurityTypes";
import { toast } from "sonner";

interface UseSecureActionOptions {
  module?: string;
  permission?: PermissionType;
  permissions?: Array<PermissionCheck>;
  requireAll?: boolean;
  actionName?: string;
  showToast?: boolean;
  logSecurity?: boolean;
}

interface SecureActionResult {
  canExecute: boolean;
  execute: <T>(action: () => T) => T | undefined;
}

/**
 * Hook for securely executing actions based on permissions
 */
export const useSecureAction = ({
  module,
  permission,
  permissions = [],
  requireAll = true,
  actionName = "ação",
  showToast = true,
  logSecurity = true
}: UseSecureActionOptions): SecureActionResult => {
  const { 
    isLovableAdmin, 
    isMaster, 
    isAdmin,
    isFreeAccessMode, 
    checkPermission,
    checkMultiplePermissions,
    checkAnyPermission,
    logSecurityEvent
  } = useSecurity();

  // Build the permission checks array
  const permissionChecks = module && permission 
    ? [...permissions, { module, permission }]
    : permissions;

  // Determine if user can execute the action
  const canExecute = 
    isLovableAdmin || 
    isFreeAccessMode || 
    isMaster || 
    isAdmin ||
    (requireAll 
      ? checkMultiplePermissions(permissionChecks)
      : checkAnyPermission(permissionChecks));

  // Execute action if permissions allow
  const execute = <T>(action: () => T): T | undefined => {
    if (!canExecute) {
      if (showToast) {
        toast.error(`Acesso negado: você não tem permissão para realizar esta ${actionName}.`);
      }
      
      if (logSecurity) {
        logSecurityEvent({
          action: 'ACTION_DENIED',
          details: { 
            actionName,
            requiredPermissions: permissionChecks 
          },
          status: 'denied'
        });
      }
      
      return undefined;
    }

    try {
      const result = action();
      
      if (logSecurity) {
        logSecurityEvent({
          action: 'ACTION_EXECUTED',
          details: { actionName },
          status: 'success'
        });
      }
      
      return result;
    } catch (error) {
      if (logSecurity) {
        logSecurityEvent({
          action: 'ACTION_ERROR',
          details: { 
            actionName,
            error: error instanceof Error ? error.message : String(error)
          },
          status: 'error'
        });
      }
      
      throw error;
    }
  };

  return { canExecute, execute };
};
