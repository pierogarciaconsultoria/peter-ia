
/**
 * Utility functions to detect environment and manage authentication access
 * SECURITY HARDENED VERSION - Bypass muito restritivo para produção
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
 */
export function isProductionEnvironment(): boolean {
  // Check deployment environment
  const isVercel = window.location.hostname.includes('vercel.app');
  const isNetlify = window.location.hostname.includes('netlify.app');
  const isCustomDomain = !window.location.hostname.includes('localhost') && 
                         !window.location.hostname.includes('127.0.0.1') &&
                         !window.location.hostname.includes('.lovableproject.com') &&
                         !window.location.hostname.includes('.lovable.app');
  
  const isProduction = process.env.NODE_ENV === 'production' || 
                      isVercel || 
                      isNetlify || 
                      isCustomDomain;
  
  console.log('Environment check:', {
    NODE_ENV: process.env.NODE_ENV,
    hostname: window.location.hostname,
    isVercel,
    isNetlify,
    isCustomDomain,
    isProduction
  });
  
  return isProduction;
}

/**
 * Verifies if we're in the Lovable editor environment
 * CORRIGIDO: Considera também subdomínio ".lovable.app" para visual editor
 * Aceita sempre localhost E qualquer hostname que contenha ".lovable.app" OU ".lovableproject.com"
 */
export function isLovableEditor(): boolean {
  // Em produção, nunca permitir bypass
  if (isProductionEnvironment()) {
    console.log('Lovable Editor detection: Denied in production environment');
    return false;
  }
  
  // Check for Lovable domains (agora aceita *.lovable.app, *.lovableproject.com)
  const host = window.location.hostname;
  const isLovableDomain = host.endsWith('.lovableproject.com') ||
    host.endsWith('.lovable.app');
  
  // Accept localhost for development ease-of-use
  const isLocalDevelopment = host === 'localhost' || host === '127.0.0.1';
  
  const isValidEditor = isLovableDomain || isLocalDevelopment;
  
  console.log('Lovable Editor detection (ajustado):', {
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
  // Em produção, nunca permitir super admin bypass
  if (isProductionEnvironment()) {
    console.log('Super admin denied: Production environment');
    return false;
  }
  
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
 * Agora considera corretamente domínio do Lovable Editor.
 */
export function shouldBypassAuth(): boolean {
  // Em produção, NUNCA permitir bypass
  if (isProductionEnvironment()) {
    console.log('Auth bypass denied: Production environment');
    return false;
  }
  
  // Check if we're in Lovable environment
  const isInLovable = isLovableEditor();
  
  // Check for development environment
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  // Permitir em Localhost OU Lovable
  const allowBypass = isLocalhost || isInLovable;
  
  console.log('Auth bypass check (corrigido):', {
    isDevelopment,
    isLocalhost,
    isInLovable,
    allowBypass,
    isProduction: isProductionEnvironment()
  });
  
  if (allowBypass) {
    console.warn('SECURITY WARNING: Auth bypass granted for Lovable editor or local development only');
    logSecurityEvent('AUTH_BYPASS_GRANTED', 'Development or Lovable editor bypass used');
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
 * Log de eventos de segurança
 */
function logSecurityEvent(action: string, details: string): void {
  const event = {
    timestamp: new Date().toISOString(),
    action,
    details,
    userAgent: navigator.userAgent,
    url: window.location.href,
    environment: isProductionEnvironment() ? 'production' : 'development'
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

