
import { useState } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SecurityAuditLogEntry } from "@/security/SecurityTypes";

interface UseSecurityAuditProps {
  showToasts?: boolean;
}

export const useSecurityAudit = ({ showToasts = false }: UseSecurityAuditProps = {}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Get client IP address (will be used for security logging)
  const getClientIp = async (): Promise<string | null> => {
    try {
      // Check if already stored in session
      const storedIp = sessionStorage.getItem('client_ip');
      if (storedIp) return storedIp;

      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      
      if (data.ip) {
        sessionStorage.setItem('client_ip', data.ip);
        return data.ip;
      }
      
      return null;
    } catch (error) {
      console.error("Failed to get client IP:", error);
      return null;
    }
  };

  // Log security event
  const logSecurityEvent = async (
    action: string,
    details?: Record<string, any>,
    status: 'success' | 'denied' | 'error' = 'success'
  ): Promise<void> => {
    try {
      setLoading(true);
      
      const clientIp = await getClientIp();
      
      const logEntry: SecurityAuditLogEntry = {
        action,
        userId: user?.id || 'anonymous',
        details,
        status,
        ipAddress: clientIp || undefined,
        timestamp: new Date()
      };
      
      // Always log to console
      console.log(`Security event: ${action}`, logEntry);
      
      // In production, store in database
      if (process.env.NODE_ENV === 'production') {
        const { error } = await supabase
          .from('security_audit_logs')
          .insert(logEntry);
        
        if (error) {
          console.error("Failed to log security event to database:", error);
          if (showToasts) {
            toast.error("Falha ao registrar evento de segurança");
          }
        }
      }
      
      // Show toast for denied or error events when enabled
      if (showToasts && status !== 'success') {
        toast.error(`Segurança: ${action} - ${status === 'denied' ? 'Acesso negado' : 'Erro'}`);
      }
      
    } catch (error) {
      console.error("Error in security audit logging:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Get security audit logs
  const getSecurityLogs = async (
    filters?: {
      userId?: string;
      action?: string;
      status?: 'success' | 'denied' | 'error';
      from?: Date;
      to?: Date;
    },
    pagination?: {
      page: number;
      pageSize: number;
    }
  ) => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('security_audit_logs')
        .select('*');
      
      // Apply filters
      if (filters?.userId) {
        query = query.eq('userId', filters.userId);
      }
      
      if (filters?.action) {
        query = query.eq('action', filters.action);
      }
      
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters?.from) {
        query = query.gte('timestamp', filters.from.toISOString());
      }
      
      if (filters?.to) {
        query = query.lte('timestamp', filters.to.toISOString());
      }
      
      // Apply pagination
      if (pagination) {
        const { page, pageSize } = pagination;
        query = query
          .order('timestamp', { ascending: false })
          .range(page * pageSize, (page + 1) * pageSize - 1);
      } else {
        query = query.order('timestamp', { ascending: false });
      }
      
      const { data, error, count } = await query;
      
      if (error) {
        throw error;
      }
      
      return { data, count };
      
    } catch (error) {
      console.error("Error fetching security logs:", error);
      if (showToasts) {
        toast.error("Falha ao carregar logs de segurança");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    logSecurityEvent,
    getSecurityLogs,
    loading
  };
};
