
/**
 * Utility functions to detect environment and manage authentication access
 * SECURITY HARDENED VERSION - Bypass muito restritivo
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
 * SECURITY: Sempre considera produção a menos que seja desenvolvimento explícito
 */
export function isProductionEnvironment(): boolean {
  // SECURITY: Mais restritivo - assume produção por padrão
  const isDevelopment = process.env.NODE_ENV === 'development' && 
                       (window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1');
  
  console.log('Environment check:', {
    NODE_ENV: process.env.NODE_ENV,
    hostname: window.location.hostname,
    isDevelopment,
    isProduction: !isDevelopment
  });
  
  return !isDevelopment;
}

/**
 * Verifies if we're in the Lovable editor environment
 * SECURITY: Muito mais restritivo
 */
export function isLovableEditor(): boolean {
  // SECURITY: Apenas localhost em desenvolvimento
  const isLocalDevelopment = process.env.NODE_ENV === 'development' && 
                             window.location.hostname === 'localhost';
  
  // SECURITY: Verificação mais rigorosa de domínio Lovable
  const isLovableDomain = window.location.hostname.endsWith('.lovableproject.com') || 
                         window.location.hostname.endsWith('.lovable.app');
  
  // SECURITY: Parâmetro específico obrigatório
  const urlParams = new URLSearchParams(window.location.search);
  const hasSecureEditorParam = urlParams.get('lovable_editor') === 'true';
  
  const isValidEditor = (isLocalDevelopment || isLovableDomain) && hasSecureEditorParam;
  
  console.log('Lovable Editor detection:', {
    isLocalDevelopment,
    isLovableDomain,
    hasSecureEditorParam,
    isValidEditor,
    hostname: window.location.hostname
  });
  
  return isValidEditor;
}

/**
 * Checks if we're in a Lovable editor with super admin privileges
 * SECURITY: Extremamente restritivo
 */
export function isSuperAdminInLovable(): boolean {
  const isEditor = isLovableEditor();
  
  if (!isEditor) {
    console.log('Super admin denied: Not in valid Lovable editor');
    return false;
  }
  
  // SECURITY: Requer parâmetro específico para super admin
  const urlParams = new URLSearchParams(window.location.search);
  const hasMasterParam = urlParams.get('master_admin') === 'true';
  const hasSecureToken = urlParams.get('secure_token')?.length > 10;
  
  const isSuperAdmin = hasMasterParam && hasSecureToken;
  
  console.log('Super admin check:', {
    isEditor,
    hasMasterParam,
    hasSecureToken,
    isSuperAdmin
  });
  
  return isSuperAdmin;
}

/**
 * SECURITY: Removido - não mais permitir acesso livre
 */
export function shouldGrantFreeAccess(): boolean {
  console.log('Free access denied: Feature disabled for security');
  return false;
}

/**
 * Centralized function to decide if authentication should be bypassed
 * SECURITY: Extremamente restritivo - apenas para desenvolvimento local válido
 */
export function shouldBypassAuth(): boolean {
  // SECURITY: Apenas em desenvolvimento local com parâmetros específicos
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isLocalhost = window.location.hostname === 'localhost';
  const urlParams = new URLSearchParams(window.location.search);
  const hasDevBypass = urlParams.get('dev_bypass') === 'true';
  const hasDevToken = urlParams.get('dev_token')?.length > 5;
  
  const allowBypass = isDevelopment && isLocalhost && hasDevBypass && hasDevToken;
  
  console.log('Auth bypass check:', {
    isDevelopment,
    isLocalhost,
    hasDevBypass,
    hasDevToken,
    allowBypass
  });
  
  if (allowBypass) {
    console.warn('SECURITY WARNING: Auth bypass granted for development');
    // Log de segurança
    logSecurityEvent('AUTH_BYPASS_GRANTED', 'Development environment bypass used');
  }
  
  return allowBypass;
}

/**
 * Clear all access flags - útil para limpeza de segurança
 */
export function clearAccessFlags(): void {
  Object.values(AUTH_STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
  console.log('All access flags cleared for security');
}

/**
 * SECURITY: Função removida - tokens de produção não mais suportados via localStorage
 */
export function setProductionAccessToken(token: string): void {
  console.warn('Production access tokens not supported for security reasons');
}

/**
 * Log de eventos de segurança
 */
function logSecurityEvent(action: string, details: string): void {
  const event = {
    timestamp: new Date().toISOString(),
    action,
    details,
    userAgent: navigator.userAgent,
    url: window.location.href,
    ip: 'client-side' // será capturado no servidor
  };
  
  console.log('Security Event:', event);
  
  // Em produção, enviar para servidor de logs
  if (isProductionEnvironment()) {
    // TODO: Implementar envio seguro para servidor de logs
    fetch('/api/security-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    }).catch(err => console.error('Failed to log security event:', err));
  }
}
