
/**
 * Utility function to detect if we're running in the Lovable editor environment
 * This helps provide demo/mock data when running in development mode
 */
export function isSuperAdminInLovable(): boolean {
  // Check if we're in a development environment
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Check if we have a special URL parameter or localStorage setting
  const hasFreeAccessParam = typeof window !== 'undefined' && 
    new URLSearchParams(window.location.search).has('freeAccess');
    
  const hasFreeAccessStorage = typeof localStorage !== 'undefined' && 
    localStorage.getItem('sgq_free_access') === 'true';
  
  // In the Lovable editor or when free access is explicitly requested
  return isDevelopment || hasFreeAccessParam || hasFreeAccessStorage;
}

/**
 * Set free access mode (useful for demo purposes)
 */
export function setFreeAccessMode(enable: boolean): void {
  if (typeof localStorage !== 'undefined') {
    if (enable) {
      localStorage.setItem('sgq_free_access', 'true');
    } else {
      localStorage.removeItem('sgq_free_access');
    }
  }
}
