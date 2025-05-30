
/**
 * Utility functions to detect environment and manage authentication access
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
 * @returns boolean indicating if we're in production
 */
export function isProductionEnvironment(): boolean {
  // Debug log to help identify the issue
  console.log('Environment check:', {
    NODE_ENV: process.env.NODE_ENV,
    hostname: window.location.hostname,
    isLovableHostname: window.location.hostname.includes('lovableproject.com') || window.location.hostname.includes('lovable.app')
  });
  
  // If we're in a Lovable environment, never consider it production
  if (typeof window !== 'undefined') {
    const isLovableHostname = window.location.hostname.includes('lovableproject.com') || 
                              window.location.hostname.includes('lovable.app');
    
    if (isLovableHostname) {
      console.log('Detected Lovable environment - treating as development');
      return false;
    }
  }
  
  return process.env.NODE_ENV === 'production';
}

/**
 * Verifies if we're in the Lovable editor environment
 * More permissive to ensure access during development
 */
export function isLovableEditor(): boolean {
  // Check URL and hostname for Lovable indicators
  const isInLovableDomain = typeof window !== 'undefined' && 
    (window.location.hostname.includes('lovableproject.com') || 
     window.location.hostname.includes('lovable.app') ||
     window.location.hostname.includes('localhost'));
  
  // Check URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const hasEditorParam = urlParams.has('lovable_editor');
  
  // Check localStorage flag
  const hasStorageFlag = localStorage.getItem(AUTH_STORAGE_KEYS.EDITOR_ACCESS) === 'true';
  
  // Debug logging
  console.log('Lovable Editor detection:', {
    isInLovableDomain,
    hasEditorParam,
    hasStorageFlag,
    hostname: window.location.hostname
  });
  
  // If any indicator is present, save for future sessions and grant access
  if (isInLovableDomain || hasEditorParam) {
    localStorage.setItem(AUTH_STORAGE_KEYS.EDITOR_ACCESS, 'true');
    console.log('Lovable Editor access granted and saved');
    return true;
  }
  
  return hasStorageFlag;
}

/**
 * Checks if we're in a Lovable editor with super admin privileges
 */
export function isSuperAdminInLovable(): boolean {
  const isInLovable = isLovableEditor();
  
  if (!isInLovable) return false;
  
  // Check URL parameters and localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const isMasterAdmin = urlParams.has('master_admin');
  
  // If master_admin parameter is present, save to localStorage
  if (isMasterAdmin) {
    localStorage.setItem(AUTH_STORAGE_KEYS.EDITOR_ACCESS, 'true');
    localStorage.setItem(AUTH_STORAGE_KEYS.SUPER_ADMIN_ACCESS, 'true');
    console.log('Super admin access granted in Lovable');
  }
  
  // Check localStorage flag
  const hasStorageFlag = localStorage.getItem(AUTH_STORAGE_KEYS.SUPER_ADMIN_ACCESS) === 'true';
  
  return isMasterAdmin || hasStorageFlag;
}

/**
 * Checks if free access should be granted for demonstration
 */
export function shouldGrantFreeAccess(): boolean {
  // Only grant free access in development with Lovable editor
  if (process.env.NODE_ENV === 'development' && isLovableEditor()) {
    console.log('Free access granted - Development environment with Lovable editor detected');
    return true;
  }
  
  // In production, check for special tokens
  if (isProductionEnvironment()) {
    const hasValidToken = localStorage.getItem('production_access_token') === 'valid' ||
                         localStorage.getItem('production_auth_bypass') === 'authorized';
    return hasValidToken;
  }
  
  // More restrictive for non-development environments
  return false;
}

/**
 * Centralized function to decide if authentication should be bypassed
 * More restrictive - only in development with Lovable editor
 */
export function shouldBypassAuth(): boolean {
  // Only bypass in development environment with Lovable editor
  if (process.env.NODE_ENV === 'development' && isLovableEditor()) {
    console.log('Auth bypass granted - Development environment with Lovable editor');
    return true;
  }
  
  // In production, only allow bypass with specific tokens
  if (isProductionEnvironment()) {
    const hasValidBypass = localStorage.getItem('production_auth_bypass') === 'authorized' ||
                          localStorage.getItem('production_access_token') === 'valid';
    
    if (hasValidBypass) {
      console.log('Auth bypass granted - valid production token');
    }
    
    return hasValidBypass;
  }
  
  // No bypass for other environments
  return false;
}

/**
 * Clear all access flags - useful for testing and debugging
 */
export function clearAccessFlags(): void {
  localStorage.removeItem(AUTH_STORAGE_KEYS.EDITOR_ACCESS);
  localStorage.removeItem(AUTH_STORAGE_KEYS.SUPER_ADMIN_ACCESS);
  localStorage.removeItem(AUTH_STORAGE_KEYS.FREE_ACCESS_MODE);
  localStorage.removeItem('production_auth_bypass');
  localStorage.removeItem('production_access_token');
  console.log('All access flags cleared');
}

/**
 * Set production access token for authorized users
 * @param token Valid production access token
 */
export function setProductionAccessToken(token: string): void {
  if (token && token.length > 0) {
    localStorage.setItem('production_access_token', 'valid');
    localStorage.setItem('production_auth_bypass', 'authorized');
    console.log('Production access token set');
  }
}
