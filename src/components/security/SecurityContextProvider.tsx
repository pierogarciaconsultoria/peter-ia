
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';
import { securityLogger, SECURITY_EVENTS } from '@/utils/securityLogger';
import { isProductionEnvironment, shouldBypassAuth } from '@/utils/lovableEditorDetection';

interface SecurityContextType {
  logAuthEvent: (action: string, success: boolean, details?: Record<string, any>) => void;
  logDataAccess: (resource: string, action: string, success: boolean, details?: Record<string, any>) => void;
  logSecurityViolation: (violation: string, details: Record<string, any>) => void;
  monitorSuspiciousActivity: (activity: string, details: Record<string, any>) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const { user, sessionExpiry, lastActivity } = useAuth();
  const { logAuthEvent, logDataAccess, logSecurityViolation } = useSecurityAudit();

  // Monitorar atividade suspeita
  const monitorSuspiciousActivity = (activity: string, details: Record<string, any>) => {
    securityLogger.logSecurityViolation(`SUSPICIOUS_${activity}`, details);
    logSecurityViolation(activity, details);
  };

  // Monitorar sessões e atividades automaticamente
  useEffect(() => {
    if (!user) return;

    // Log de início de sessão
    logAuthEvent(SECURITY_EVENTS.AUTH.LOGIN_SUCCESS, true, {
      userId: user.id,
      sessionStart: new Date().toISOString()
    });

    // Monitorar expiração de sessão
    if (sessionExpiry) {
      const timeToExpiry = new Date(sessionExpiry).getTime() - Date.now();
      if (timeToExpiry > 0 && timeToExpiry < 5 * 60 * 1000) { // 5 minutos antes
        logAuthEvent(SECURITY_EVENTS.AUTH.SESSION_EXPIRED, false, {
          userId: user.id,
          timeToExpiry: timeToExpiry
        });
      }
    }

    // Monitorar inatividade
    if (lastActivity) {
      const inactiveTime = Date.now() - new Date(lastActivity).getTime();
      if (inactiveTime > 30 * 60 * 1000) { // 30 minutos de inatividade
        monitorSuspiciousActivity('LONG_INACTIVITY', {
          userId: user.id,
          inactiveTime: inactiveTime,
          lastActivity: lastActivity
        });
      }
    }
  }, [user, sessionExpiry, lastActivity]);

  // Monitorar tentativas de bypass em produção
  useEffect(() => {
    if (isProductionEnvironment() && shouldBypassAuth()) {
      logSecurityViolation('PRODUCTION_BYPASS_ATTEMPT', {
        environment: 'production',
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });
    }
  }, []);

  // Monitorar mudanças de URL suspeitas
  useEffect(() => {
    const handleLocationChange = () => {
      const suspiciousPatterns = [
        '/admin',
        '/debug',
        '/api',
        '?bypass=true',
        '?admin=true'
      ];

      const currentUrl = window.location.href;
      const hasSuspiciousPattern = suspiciousPatterns.some(pattern => 
        currentUrl.includes(pattern)
      );

      if (hasSuspiciousPattern) {
        monitorSuspiciousActivity('SUSPICIOUS_URL_ACCESS', {
          url: currentUrl,
          userId: user?.id,
          timestamp: new Date().toISOString()
        });
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    handleLocationChange(); // Check current URL

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, [user]);

  const contextValue: SecurityContextType = {
    logAuthEvent,
    logDataAccess,
    logSecurityViolation,
    monitorSuspiciousActivity,
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = (): SecurityContextType => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity deve ser usado dentro de um SecurityProvider');
  }
  return context;
};
