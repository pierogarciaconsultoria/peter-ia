import { supabase } from "@/integrations/supabase/client";
import { isProductionEnvironment } from "@/utils/lovableEditorDetection";

export interface Audit {
  id: string;
  title: string;
  description?: string;
  area: string;
  responsible: string;
  audit_date: string;
  status: 'planned' | 'in_progress' | 'completed' | 'canceled';
  findings?: string;
  completion_date?: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLogEntry {
  action: string;
  user_id?: string;
  target_resource?: string;
  details?: Record<string, any>;
  status: 'success' | 'denied' | 'error';
  ip_address?: string;
  timestamp: Date;
}

export async function getAudits(): Promise<Audit[]> {
  try {
    const { data, error } = await supabase
      .from('audits')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Erro ao buscar auditorias:", error.message);
      return [];
    }
    
    return (data || []).map(audit => ({
      ...audit,
      audit_date: audit.audit_date,
      completion_date: audit.completion_date,
      created_at: audit.created_at,
      updated_at: audit.updated_at
    })) as Audit[];
  } catch (error) {
    console.error("Erro inesperado ao buscar auditorias:", error);
    return [];
  }
}

export async function logAuditEvent(entry: Omit<AuditLogEntry, 'timestamp'>): Promise<void> {
  try {
    const auditEntry = {
      ...entry,
      timestamp: new Date().toISOString(), // Convert to string
      ip_address: entry.ip_address || window.sessionStorage.getItem('client_ip') || undefined
    };

    // Always log to console for debugging
    console.log('🔒 Audit Event:', auditEntry);

    // In production, also store in database
    if (isProductionEnvironment()) {
      const { error } = await supabase.rpc('log_security_event', {
        action_text: entry.action,
        user_id_text: entry.user_id || 'anonymous',
        target_resource_text: entry.target_resource || null,
        details_json: entry.details || {},
        status_text: entry.status,
        ip_address_text: auditEntry.ip_address || null
      });

      if (error) {
        console.error('Failed to log audit event to database:', error);
      }
    }
  } catch (error) {
    console.error('Error in audit logging:', error);
  }
}

export async function getAuditLogs(filters?: {
  user_id?: string;
  action?: string;
  status?: string;
  from_date?: Date;
  to_date?: Date;
  page?: number;
  limit?: number;
}): Promise<AuditLogEntry[]> {
  try {
    if (!isProductionEnvironment()) {
      console.log('Audit logs only available in production');
      return [];
    }

    const { data, error } = await supabase.rpc('get_security_logs_paginated', {
      user_id_filter: filters?.user_id || null,
      action_filter: filters?.action || null,
      status_filter: filters?.status || null,
      from_date: filters?.from_date || null,
      to_date: filters?.to_date || null,
      page_number: filters?.page || 0,
      page_size: filters?.limit || 50
    });

    if (error) {
      console.error('Error fetching audit logs:', error);
      return [];
    }

    return (data || []).map((log: any) => ({
      action: log.action,
      user_id: log.user_id,
      target_resource: log.target_resource,
      details: log.details,
      status: log.status,
      ip_address: log.ip_address,
      timestamp: new Date(log.event_timestamp)
    }));
  } catch (error) {
    console.error('Unexpected error fetching audit logs:', error);
    return [];
  }
}

// Helper function to log common security events
export const SecurityAudit = {
  loginAttempt: (userId: string, success: boolean, details?: any) =>
    logAuditEvent({
      action: 'LOGIN_ATTEMPT',
      user_id: userId,
      status: success ? 'success' : 'denied',
      details
    }),

  dataAccess: (userId: string, resource: string, success: boolean) =>
    logAuditEvent({
      action: 'DATA_ACCESS',
      user_id: userId,
      target_resource: resource,
      status: success ? 'success' : 'denied'
    }),

  dataModification: (userId: string, resource: string, action: string, details?: any) =>
    logAuditEvent({
      action: `DATA_${action.toUpperCase()}`,
      user_id: userId,
      target_resource: resource,
      status: 'success',
      details
    }),

  permissionDenied: (userId: string, resource: string, action: string) =>
    logAuditEvent({
      action: 'PERMISSION_DENIED',
      user_id: userId,
      target_resource: resource,
      status: 'denied',
      details: { attempted_action: action }
    }),

  configurationChange: (userId: string, component: string, details?: any) =>
    logAuditEvent({
      action: 'CONFIGURATION_CHANGE',
      user_id: userId,
      target_resource: component,
      status: 'success',
      details
    })
};
