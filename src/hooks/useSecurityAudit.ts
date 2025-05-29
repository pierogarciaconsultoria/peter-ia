import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
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
      
      // In production, store in database using our custom RPC function
      if (process.env.NODE_ENV === 'production') {
        // Using the RPC function we created to handle type issues
        const { error } = await supabase
          .rpc('log_security_event', {
            action_text: action,
            user_id_text: user?.id || 'anonymous',
            target_resource_text: null,
            details_json: details || {},
            status_text: status,
            ip_address_text: clientIp || null
          });
        
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
      
      // Use RPC functions to handle type issues
      let result;
      
      if (pagination) {
        result = await supabase.rpc('get_security_logs_paginated', {
          user_id_filter: filters?.userId || null,
          action_filter: filters?.action || null,
          status_filter: filters?.status || null,
          from_date: filters?.from?.toISOString() || null,
          to_date: filters?.to?.toISOString() || null,
          page_number: pagination.page,
          page_size: pagination.pageSize
        });
      } else {
        result = await supabase.rpc('get_security_logs', {
          user_id_filter: filters?.userId || null,
          action_filter: filters?.action || null,
          status_filter: filters?.status || null,
          from_date: filters?.from?.toISOString() || null,
          to_date: filters?.to?.toISOString() || null
        });
      }
      
      const { data, error, count } = result;
      
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
