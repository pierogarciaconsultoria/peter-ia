
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { securityLogger, SECURITY_EVENTS } from '@/utils/securityLogger';

export interface SecurityAuditLog {
  id: string;
  action: string;
  user_id: string;
  target_resource?: string;
  details: Record<string, any>;
  status: 'success' | 'denied' | 'error';
  ip_address?: string;
  timestamp: string;
  created_at: string;
}

export const useSecurityAudit = () => {
  const { user } = useAuth();

  const logSecurityEvent = useCallback(async (
    action: string,
    status: 'success' | 'denied' | 'error',
    details: Record<string, any> = {},
    targetResource?: string
  ) => {
    try {
      // Log localmente primeiro
      securityLogger.logEvent(action, status === 'error' ? 'high' : 'medium', details);

      // Se tiver usuário autenticado, salvar no banco
      if (user) {
        const { error } = await supabase
          .from('security_audit_logs')
          .insert({
            action,
            user_id: user.id,
            target_resource: targetResource,
            details,
            status,
            ip_address: await getClientIP(),
          });

        if (error) {
          console.error('Erro ao salvar log de segurança:', error);
        }
      }
    } catch (error) {
      console.error('Erro no sistema de auditoria:', error);
    }
  }, [user]);

  const getSecurityLogs = useCallback(async (
    filters?: {
      action?: string;
      status?: string;
      userId?: string;
      fromDate?: string;
      toDate?: string;
    }
  ): Promise<SecurityAuditLog[]> => {
    try {
      let query = supabase
        .from('security_audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (filters?.action) {
        query = query.eq('action', filters.action);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.userId) {
        query = query.eq('user_id', filters.userId);
      }
      if (filters?.fromDate) {
        query = query.gte('timestamp', filters.fromDate);
      }
      if (filters?.toDate) {
        query = query.lte('timestamp', filters.toDate);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar logs de segurança:', error);
      return [];
    }
  }, []);

  // Funções de conveniência para eventos específicos
  const logAuthEvent = useCallback((action: string, success: boolean, details?: Record<string, any>) => {
    logSecurityEvent(
      action,
      success ? 'success' : 'denied',
      details,
      'authentication'
    );
  }, [logSecurityEvent]);

  const logDataAccess = useCallback((resource: string, action: string, success: boolean, details?: Record<string, any>) => {
    logSecurityEvent(
      `${action.toUpperCase()}_${resource.toUpperCase()}`,
      success ? 'success' : 'denied',
      details,
      resource
    );
  }, [logSecurityEvent]);

  const logSecurityViolation = useCallback((violation: string, details: Record<string, any>) => {
    logSecurityEvent(
      `SECURITY_VIOLATION_${violation}`,
      'error',
      details,
      'security'
    );
  }, [logSecurityEvent]);

  return {
    logSecurityEvent,
    logAuthEvent,
    logDataAccess,
    logSecurityViolation,
    getSecurityLogs,
  };
};

// Helper para obter IP do cliente
async function getClientIP(): Promise<string | undefined> {
  try {
    // Em produção, isso seria obtido do cabeçalho HTTP
    // Por enquanto, retornamos um placeholder
    return 'client-side';
  } catch {
    return undefined;
  }
}
