
// Tipos para autenticação e claims JWT
export interface JWTClaims {
  role: 'super_admin' | 'company_admin' | 'user';
  company_id?: string;
  permissions?: string[];
  user_id: string;
}

export interface SecurityContext {
  hasPermission: (table: string, action: string, targetId?: string) => boolean;
  canAccessCompany: (companyId: string) => boolean;
  canAccessUser: (userId: string) => boolean;
  getUserRole: () => string;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  isCompanyAdmin: () => boolean;
}

export interface AuthPerformanceMetrics {
  queriesCount: number;
  avgQueryTime: number;
  cacheHitRate: number;
  lastOptimization: Date;
}
