
/**
 * Security system type definitions
 * These types define the structure of our security system
 */

export type PermissionType = 'visualizar' | 'editar' | 'excluir' | 'criar';

export interface SecurityAuditLogEntry {
  action: string;
  userId?: string;
  targetResource?: string;
  details?: Record<string, any>;
  status: 'success' | 'denied' | 'error';
  ipAddress?: string;
  timestamp: Date;
}

export interface PermissionCheck {
  module: string;
  permission: PermissionType;
}

export interface SecurityContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isMaster: boolean;
  isLovableAdmin: boolean;
  isFreeAccessMode: boolean;
  checkPermission: (module: string, permission: PermissionType) => boolean;
  checkMultiplePermissions: (checks: PermissionCheck[]) => boolean;
  checkAnyPermission: (checks: PermissionCheck[]) => boolean;
  logSecurityEvent: (entry: Omit<SecurityAuditLogEntry, 'timestamp'>) => void;
}
