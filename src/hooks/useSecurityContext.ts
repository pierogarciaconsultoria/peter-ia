
import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SecurityContext } from '@/types/auth';
import { logger } from '@/utils/logger';

export const useSecurityContext = (): SecurityContext => {
  const { user, userProfile, isSuperAdmin, isCompanyAdmin } = useAuth();

  return useMemo(() => {
    const getUserRole = (): string => {
      if (isSuperAdmin) return 'super_admin';
      if (isCompanyAdmin) return 'company_admin';
      return 'user';
    };

    const hasPermission = (table: string, action: string, targetId?: string): boolean => {
      logger.debug('SecurityContext', 'Checking permission', { 
        table, 
        action, 
        targetId, 
        userRole: getUserRole() 
      });

      // Super admin tem acesso total
      if (isSuperAdmin) {
        logger.debug('SecurityContext', 'Super admin access granted');
        return true;
      }

      // Company admin tem acesso limitado à empresa
      if (isCompanyAdmin) {
        if (table === 'companies' && targetId === userProfile?.company_id) {
          return true;
        }
        if (['employees', 'user_profiles'].includes(table)) {
          return true; // RLS filtrará por company_id
        }
        logger.debug('SecurityContext', 'Company admin access evaluated');
        return true;
      }

      // Usuário comum
      if (table === 'user_profiles' && action === 'SELECT') {
        return true; // RLS permitirá apenas seus dados
      }
      if (table === 'user_profiles' && action === 'UPDATE' && targetId === user?.id) {
        return true;
      }

      logger.debug('SecurityContext', 'Access denied for user');
      return false;
    };

    const canAccessCompany = (companyId: string): boolean => {
      if (isSuperAdmin) return true;
      if (isCompanyAdmin && userProfile?.company_id === companyId) return true;
      if (userProfile?.company_id === companyId) return true; // Usuário da empresa
      return false;
    };

    const canAccessUser = (userId: string): boolean => {
      if (isSuperAdmin) return true;
      if (user?.id === userId) return true; // Próprios dados
      
      // Company admin pode acessar usuários da empresa
      if (isCompanyAdmin) {
        // A verificação será feita pela RLS policy
        return true;
      }
      
      return false;
    };

    return {
      hasPermission,
      canAccessCompany,
      canAccessUser,
      getUserRole,
      isAdmin: () => isSuperAdmin || isCompanyAdmin,
      isSuperAdmin: () => isSuperAdmin,
      isCompanyAdmin: () => isCompanyAdmin,
    };
  }, [user, userProfile, isSuperAdmin, isCompanyAdmin]);
};
