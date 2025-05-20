
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
  return process.env.NODE_ENV === 'production';
}

/**
 * Verifies if we're in the Lovable editor environment
 * More restrictive in production to prevent unauthorized access
 */
export function isLovableEditor(): boolean {
  // In production, we're more restrictive about editor detection
  if (isProductionEnvironment()) {
    // Only allow specific Lovable domains in production
    const isInLovableIframe = typeof window !== 'undefined' && 
      (window.location.hostname.includes('lovableproject.com') || 
       window.location.hostname.includes('lovable.app'));
    
    return isInLovableIframe;
  }
  
  // In development, we're more permissive
  // Check URL parameters and localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const hasEditorParam = urlParams.has('lovable_editor');
  const hasStorageFlag = localStorage.getItem(AUTH_STORAGE_KEYS.EDITOR_ACCESS) === 'true';
  
  // Special domains that indicate we're in the Lovable environment
  const isInLovableDomain = typeof window !== 'undefined' && 
    (window.location.hostname.includes('lovableproject.com') || 
     window.location.hostname.includes('lovable.app'));
  
  // If detected as editor in development, save for future sessions
  if (isInLovableDomain || hasEditorParam) {
    localStorage.setItem(AUTH_STORAGE_KEYS.EDITOR_ACCESS, 'true');
  }
  
  return isInLovableDomain || hasEditorParam || hasStorageFlag;
}

/**
 * Checks if we're in a Lovable editor with super admin privileges
 * More restrictive in production
 */
export function isSuperAdminInLovable(): boolean {
  const isInLovable = isLovableEditor();
  
  if (!isInLovable) return false;
  
  // In production, we're more restrictive
  if (isProductionEnvironment()) {
    // Only trust authenticated super admins in production
    return false;
  }
  
  // In development, check URL parameters and localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const isMasterAdmin = urlParams.has('master_admin');
  
  // If master_admin parameter is present, save to localStorage
  if (isMasterAdmin) {
    localStorage.setItem(AUTH_STORAGE_KEYS.EDITOR_ACCESS, 'true');
    localStorage.setItem(AUTH_STORAGE_KEYS.SUPER_ADMIN_ACCESS, 'true');
  }
  
  // Check localStorage flag
  const hasStorageFlag = localStorage.getItem(AUTH_STORAGE_KEYS.SUPER_ADMIN_ACCESS) === 'true';
  
  return isMasterAdmin || hasStorageFlag;
}

/**
 * Checks if free access should be granted for demonstration
 * Restricted in production to prevent unauthorized access
 */
export function shouldGrantFreeAccess(): boolean {
  // In production, we're much more restrictive about free access
  if (isProductionEnvironment()) {
    // Check for a special production access token instead
    return localStorage.getItem('production_access_token') === 'valid';
  }
  
  // In development, more permissive checks
  const urlParams = new URLSearchParams(window.location.search);
  const hasFreeAccessParam = urlParams.has('free_access');
  
  // Check localStorage flag
  const hasStorageFlag = localStorage.getItem(AUTH_STORAGE_KEYS.FREE_ACCESS_MODE) === 'true';
  
  // Save to localStorage if URL parameter present
  if (hasFreeAccessParam) {
    localStorage.setItem(AUTH_STORAGE_KEYS.FREE_ACCESS_MODE, 'true');
  }
  
  // For easier testing in development within Lovable
  const isLovable = isLovableEditor();
  
  return hasFreeAccessParam || hasStorageFlag || isLovable;
}

/**
 * Centralized function to decide if authentication should be bypassed
 * More restrictive in production
 */
export function shouldBypassAuth(): boolean {
  // In production, only allow bypass in very specific circumstances
  if (isProductionEnvironment()) {
    // Check for a special production auth bypass token
    return localStorage.getItem('production_auth_bypass') === 'authorized';
  }
  
  // In development, more permissive
  return isLovableEditor() || isSuperAdminInLovable() || shouldGrantFreeAccess();
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
}

/**
 * Set production access token for authorized users
 * @param token Valid production access token
 */
export function setProductionAccessToken(token: string): void {
  if (token && token.length > 0) {
    localStorage.setItem('production_access_token', token);
  }
}
