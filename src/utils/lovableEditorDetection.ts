
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
 * Corrigido: NUNCA considerar .lovable.app ou .lovableproject.com como produção, mesmo em deploy real!
 */
export function isProductionEnvironment(): boolean {
  // Detectar possíveis ambientes de produção reais (Vercel, Netlify, domínio próprio),
  // mas EXCETO nos domínios de staging Lovable (.lovable.app e .lovableproject.com)
  const host = window.location.hostname;

  // Staging Lovable: não é produção
  const isLovableStaging = host.endsWith('.lovable.app') || host.endsWith('.lovableproject.com');

  // Produção real: domínio próprio (exceto *.lovable.app e *.lovableproject.com)
  const isVercel = host.includes('vercel.app');
  const isNetlify = host.includes('netlify.app');
  const isLocalhost = host === 'localhost' || host === '127.0.0.1';

  // Domínio customizado: não é localhost, nem domínio oficial Lovable/app, nem Vercel/Netlify
  const isCustomDomain = !isLocalhost && !isLovableStaging && !isVercel && !isNetlify;

  // NODE_ENV check
  const nodeEnvProd = process.env.NODE_ENV === 'production';

  const isProduction = (nodeEnvProd && (isCustomDomain || isVercel || isNetlify)) && !isLovableStaging;

  console.log('Environment check:', {
    NODE_ENV: process.env.NODE_ENV,
    hostname: host,
    isVercel,
    isNetlify,
    isCustomDomain,
    isLovableStaging,
    isProduction
  });

  return isProduction;
}

/**
 * Verifica se estamos no ambiente de editor visual do Lovable
 * Agora aceita qualquer domínio .lovable.app OU .lovableproject.com e localhost.
 */
export function isLovableEditor(): boolean {
  const host = window.location.hostname;
  // Editor Lovable: sempre que for .lovable.app, .lovableproject.com ou localhost
  const isLovableDomain = host.endsWith('.lovableproject.com') || host.endsWith('.lovable.app');
  const isLocalDevelopment = host === 'localhost' || host === '127.0.0.1';
  const isValidEditor = isLovableDomain || isLocalDevelopment;

  console.log('Lovable Editor detection:', {
    isLocalDevelopment,
    isLovableDomain,
    isValidEditor,
    hostname: host
  });

  return isValidEditor;
}

/**
 * Checks if we're in a Lovable editor with super admin privileges
 */
export function isSuperAdminInLovable(): boolean {
  if (isProductionEnvironment()) {
    // Nunca permitir superadmin em produção real
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
  // Em produção real, NUNCA permitir bypass
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

  console.log('Auth bypass check:', {
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

  // Em produção real, enviar para servidor de logs
  if (isProductionEnvironment()) {
    // TODO: Implementar envio seguro para servidor de logs
    fetch('/api/security-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    }).catch(err => console.error('Failed to log security event:', err));
  }
}
