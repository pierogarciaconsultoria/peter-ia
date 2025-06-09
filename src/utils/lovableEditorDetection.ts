
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
 * MODIFIED: More permissive for Lovable environment
 */
export function isProductionEnvironment(): boolean {
  // Check if we're in Lovable environment first
  const isLovableDomain = window.location.hostname.endsWith('.lovableproject.com') || 
                         window.location.hostname.endsWith('.lovable.app');
  
  // If in Lovable, not production
  if (isLovableDomain) {
    return false;
  }
  
  // Original production detection logic
  const isDevelopment = process.env.NODE_ENV === 'development' && 
                       (window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1');
  
  console.log('Environment check:', {
    NODE_ENV: process.env.NODE_ENV,
    hostname: window.location.hostname,
    isLovableDomain,
    isDevelopment,
    isProduction: !isDevelopment && !isLovableDomain
  });
  
  return !isDevelopment && !isLovableDomain;
}

/**
 * Verifies if we're in the Lovable editor environment
 * MODIFIED: More permissive detection
 */
export function isLovableEditor(): boolean {
  // Check for Lovable domains
  const isLovableDomain = window.location.hostname.endsWith('.lovableproject.com') || 
                         window.location.hostname.endsWith('.lovable.app');
  
  // Check for localhost development
  const isLocalDevelopment = process.env.NODE_ENV === 'development' && 
                             window.location.hostname === 'localhost';
  
  // More permissive - allow Lovable domains without requiring specific parameters
  const isValidEditor = isLovableDomain || isLocalDevelopment;
  
  console.log('Lovable Editor detection:', {
    isLocalDevelopment,
    isLovableDomain,
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
 * MODIFIED: More permissive for development environments
 */
export function shouldBypassAuth(): boolean {
  // Check if we're in Lovable environment
  const isInLovable = isLovableEditor();
  
  // Check for development environment
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isLocalhost = window.location.hostname === 'localhost';
  
  // More permissive for development and Lovable environments
  const allowBypass = (isDevelopment && isLocalhost) || isInLovable;
  
  console.log('Auth bypass check:', {
    isDevelopment,
    isLocalhost,
    isInLovable,
    allowBypass
  });
  
  if (allowBypass) {
    console.warn('SECURITY WARNING: Auth bypass granted for development/Lovable environment');
    // Log de segurança
    logSecurityEvent('AUTH_BYPASS_GRANTED', 'Development/Lovable environment bypass used');
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
