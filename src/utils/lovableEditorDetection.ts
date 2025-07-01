
/**
 * Utility functions to detect environment and manage authentication access
 * SECURITY HARDENED VERSION - Produção segura
 */

// Shared storage keys for consistent access across functions
const AUTH_STORAGE_KEYS = {
  EDITOR_ACCESS: 'lovableEditorAccess',
  SUPER_ADMIN_ACCESS: 'lovableSuperAdminAccess',
  FREE_ACCESS_MODE: 'freeAccessMode',
  PRODUCTION_MODE: 'productionMode'
};

/**
 * Detects if the application is running in a production environment
 * SECURITY: Restrição rigorosa para produção
 */
export function isProductionEnvironment(): boolean {
  const host = window.location.hostname;
  const nodeEnvProd = process.env.NODE_ENV === 'production';
  
  // Domínios de desenvolvimento/staging que NUNCA são produção
  const isLovableStaging = host.endsWith('.lovable.app') || host.endsWith('.lovableproject.com');
  const isLocalhost = host === 'localhost' || host === '127.0.0.1';
  const isVercelPreview = host.includes('vercel.app') && !host.includes('peteria'); // Assumindo domínio próprio
  const isNetlifyPreview = host.includes('netlify.app') && !host.includes('peteria');
  
  // Produção real: NODE_ENV=production E domínio próprio
  const isCustomDomain = !isLocalhost && !isLovableStaging && !isVercelPreview && !isNetlifyPreview;
  const isProduction = nodeEnvProd && isCustomDomain;
  
  // Log para auditoria
  console.log('Environment detection:', {
    NODE_ENV: process.env.NODE_ENV,
    hostname: host,
    isProduction,
    isCustomDomain,
    securityLevel: isProduction ? 'HIGH' : 'DEVELOPMENT'
  });
  
  return isProduction;
}

/**
 * Verifica se estamos no ambiente de editor do Lovable
 * SECURITY: Apenas para desenvolvimento
 */
export function isLovableEditor(): boolean {
  if (isProductionEnvironment()) {
    return false; // NUNCA permitir em produção
  }
  
  const host = window.location.hostname;
  const isLovableDomain = host.endsWith('.lovableproject.com') || host.endsWith('.lovable.app');
  const isLocalDevelopment = host === 'localhost' || host === '127.0.0.1';
  
  return isLovableDomain || isLocalDevelopment;
}

/**
 * Checks if we're in a Lovable editor with super admin privileges
 * SECURITY: Muito restritivo - apenas desenvolvimento com tokens específicos
 */
export function isSuperAdminInLovable(): boolean {
  // NEVER em produção
  if (isProductionEnvironment()) {
    logSecurityEvent('SUPER_ADMIN_ATTEMPT_PRODUCTION', 'Tentativa de super admin em produção NEGADA');
    return false;
  }
  
  // Apenas em editor Lovable válido
  if (!isLovableEditor()) {
    return false;
  }
  
  // SECURITY: Requer múltiplos parâmetros específicos
  const urlParams = new URLSearchParams(window.location.search);
  const hasMasterParam = urlParams.get('master_admin') === 'true';
  const hasSecureToken = urlParams.get('secure_token') === 'peter_ia_dev_2024';
  const hasTimestamp = Math.abs(Date.now() - parseInt(urlParams.get('timestamp') || '0')) < 3600000; // 1 hora
  
  const isSuperAdmin = hasMasterParam && hasSecureToken && hasTimestamp;
  
  if (isSuperAdmin) {
    logSecurityEvent('SUPER_ADMIN_ACCESS_GRANTED', 'Super admin access granted in development');
  }
  
  return isSuperAdmin;
}

/**
 * SECURITY: Acesso livre removido completamente
 */
export function shouldGrantFreeAccess(): boolean {
  return false;
}

/**
 * Centralized function to decide if authentication should be bypassed
 * SECURITY: Muito restritivo - apenas desenvolvimento local
 */
export function shouldBypassAuth(): boolean {
  // NUNCA em produção
  if (isProductionEnvironment()) {
    logSecurityEvent('AUTH_BYPASS_DENIED_PRODUCTION', 'Auth bypass negado em produção');
    return false;
  }
  
  // Apenas localhost em desenvolvimento
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const allowBypass = isLocalhost && isDevelopment;
  
  if (allowBypass) {
    logSecurityEvent('AUTH_BYPASS_GRANTED_DEV', 'Auth bypass concedido apenas para desenvolvimento local');
  }
  
  return allowBypass;
}

/**
 * Clear all access flags - para limpeza de segurança
 */
export function clearAccessFlags(): void {
  Object.values(AUTH_STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
  logSecurityEvent('ACCESS_FLAGS_CLEARED', 'Flags de acesso limpos por segurança');
}

/**
 * Log de eventos de segurança robusto
 */
function logSecurityEvent(action: string, details: string): void {
  const event = {
    timestamp: new Date().toISOString(),
    action,
    details,
    userAgent: navigator.userAgent,
    url: window.location.href,
    environment: isProductionEnvironment() ? 'PRODUCTION' : 'DEVELOPMENT',
    severity: action.includes('DENIED') || action.includes('PRODUCTION') ? 'HIGH' : 'MEDIUM'
  };
  
  // Log local para desenvolvimento
  if (event.severity === 'HIGH') {
    console.error('🚨 SECURITY ALERT:', event);
  } else {
    console.warn('🔒 Security Event:', event);
  }
  
  // Em produção, enviar para sistema de monitoramento
  if (isProductionEnvironment()) {
    // Implementar envio para Sentry/LogRocket/etc
    try {
      fetch('/api/security-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      }).catch(err => console.error('Failed to log security event:', err));
    } catch (error) {
      console.error('Security logging error:', error);
    }
  }
}

/**
 * Função para validar integridade do ambiente
 */
export function validateEnvironmentIntegrity(): {
  isSecure: boolean;
  warnings: string[];
  errors: string[];
} {
  const warnings: string[] = [];
  const errors: string[] = [];
  
  // Verificar NODE_ENV
  if (!process.env.NODE_ENV) {
    warnings.push('NODE_ENV não definido');
  }
  
  // Verificar se estamos em produção sem HTTPS
  if (isProductionEnvironment() && window.location.protocol !== 'https:') {
    errors.push('Produção deve usar HTTPS');
  }
  
  // Verificar se há bypass ativo em produção
  if (isProductionEnvironment() && (shouldBypassAuth() || isSuperAdminInLovable())) {
    errors.push('Bypass de segurança ativo em produção');
  }
  
  // Verificar localStorage para dados sensíveis
  try {
    const sensitiveKeys = ['password', 'token', 'secret', 'key'];
    Object.keys(localStorage).forEach(key => {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        warnings.push(`Possível dado sensível no localStorage: ${key}`);
      }
    });
  } catch (error) {
    // Ignorar erros de acesso ao localStorage
  }
  
  const isSecure = errors.length === 0;
  
  // Log do resultado da validação
  logSecurityEvent('ENVIRONMENT_VALIDATION', `Secure: ${isSecure}, Warnings: ${warnings.length}, Errors: ${errors.length}`);
  
  return { isSecure, warnings, errors };
}
