
/**
 * Sistema de Logs de Segurança
 * Centraliza todos os eventos de segurança da aplicação
 */

export interface SecurityEvent {
  timestamp: string;
  action: string;
  userId?: string;
  sessionId?: string;
  userAgent: string;
  ip?: string;
  details: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
}

class SecurityLogger {
  private events: SecurityEvent[] = [];
  private maxEvents = 1000; // Limite de eventos em memória

  logEvent(
    action: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    details: Record<string, any> = {},
    source: string = 'client'
  ): void {
    const event: SecurityEvent = {
      timestamp: new Date().toISOString(),
      action,
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId(),
      userAgent: navigator.userAgent,
      details,
      severity,
      source
    };

    this.events.push(event);

    // Manter apenas os últimos eventos
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Log no console baseado na severidade
    const logMethod = this.getLogMethod(severity);
    logMethod(`SECURITY [${severity.toUpperCase()}]: ${action}`, details);

    // Em produção, enviar para servidor
    if (process.env.NODE_ENV === 'production') {
      this.sendToServer(event);
    }
  }

  private getCurrentUserId(): string | undefined {
    try {
      const authData = localStorage.getItem('supabase.auth.token');
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed?.user?.id;
      }
    } catch {
      // Ignorar erros silenciosamente
    }
    return undefined;
  }

  private getSessionId(): string | undefined {
    try {
      const authData = localStorage.getItem('supabase.auth.token');
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed?.access_token?.substring(0, 16); // Apenas parte do token
      }
    } catch {
      // Ignorar erros silenciosamente
    }
    return undefined;
  }

  private getLogMethod(severity: string) {
    switch (severity) {
      case 'critical':
      case 'high':
        return console.error;
      case 'medium':
        return console.warn;
      default:
        return console.log;
    }
  }

  private async sendToServer(event: SecurityEvent): Promise<void> {
    try {
      await fetch('/api/security-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event)
      });
    } catch (error) {
      console.error('Failed to send security event to server:', error);
    }
  }

  // Métodos de conveniência para diferentes tipos de eventos
  logAuthEvent(action: string, details: Record<string, any> = {}): void {
    this.logEvent(action, 'medium', details, 'auth');
  }

  logSecurityViolation(action: string, details: Record<string, any> = {}): void {
    this.logEvent(action, 'high', details, 'security');
  }

  logCriticalEvent(action: string, details: Record<string, any> = {}): void {
    this.logEvent(action, 'critical', details, 'critical');
  }

  logAccessAttempt(success: boolean, details: Record<string, any> = {}): void {
    const action = success ? 'ACCESS_GRANTED' : 'ACCESS_DENIED';
    const severity = success ? 'low' : 'medium';
    this.logEvent(action, severity, details, 'access');
  }

  // Obter relatório de eventos recentes
  getRecentEvents(hours: number = 24): SecurityEvent[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.events.filter(event => new Date(event.timestamp) > cutoff);
  }

  // Obter estatísticas de segurança
  getSecurityStats(): {
    totalEvents: number;
    criticalEvents: number;
    highSeverityEvents: number;
    recentFailedLogins: number;
  } {
    const recent = this.getRecentEvents(24);
    
    return {
      totalEvents: this.events.length,
      criticalEvents: recent.filter(e => e.severity === 'critical').length,
      highSeverityEvents: recent.filter(e => e.severity === 'high').length,
      recentFailedLogins: recent.filter(e => 
        e.action.includes('LOGIN_FAILED') || e.action.includes('ACCESS_DENIED')
      ).length
    };
  }
}

// Instância singleton
export const securityLogger = new SecurityLogger();

// Eventos de segurança comuns
export const SECURITY_EVENTS = {
  AUTH: {
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILED: 'LOGIN_FAILED',
    LOGOUT: 'LOGOUT',
    SESSION_EXPIRED: 'SESSION_EXPIRED',
    UNAUTHORIZED_ACCESS: 'UNAUTHORIZED_ACCESS'
  },
  DATA: {
    SENSITIVE_DATA_ACCESS: 'SENSITIVE_DATA_ACCESS',
    DATA_EXPORT: 'DATA_EXPORT',
    BULK_OPERATION: 'BULK_OPERATION'
  },
  SYSTEM: {
    BYPASS_ATTEMPT: 'BYPASS_ATTEMPT',
    PRIVILEGE_ESCALATION: 'PRIVILEGE_ESCALATION',
    SUSPICIOUS_ACTIVITY: 'SUSPICIOUS_ACTIVITY'
  }
} as const;
