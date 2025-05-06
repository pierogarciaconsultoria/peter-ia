
/**
 * Helper functions for detecting if the app is running in Lovable Editor
 * and applying special access rules
 */

/**
 * Checks if the app is currently running in Lovable Editor
 */
export const isLovableEditor = (): boolean => {
  // Check if running in Lovable Editor or preview via URL parameters
  const url = new URL(window.location.href);
  const isEditor = url.searchParams.has("lovable_editor") 
                || url.hostname.includes("lovable.cloud")
                || url.hostname.includes("lovable.app");
  
  return isEditor;
};

/**
 * Checks if the current editor session should be granted super admin privileges
 */
export const isSuperAdminInLovable = (): boolean => {
  // If not in editor, definitely not super admin
  if (!isLovableEditor()) {
    return false;
  }
  
  // Check explicit master admin parameter
  const url = new URL(window.location.href);
  const isMasterAdmin = url.searchParams.has("master_admin");
  
  // Check saved session state
  const savedAccess = localStorage.getItem('lovableEditorAccess') === 'super_admin';
  
  // If master_admin parameter is set, save it for future use
  if (isMasterAdmin) {
    localStorage.setItem('lovableEditorAccess', 'super_admin');
  }
  
  return isMasterAdmin || savedAccess;
};

/**
 * Check if the current access mode should grant free access for demonstration purposes
 * This can be toggled by URL parameter or localStorage setting
 */
export const shouldGrantFreeAccess = (): boolean => {
  const url = new URL(window.location.href);
  const freeAccessParam = url.searchParams.has("free_access");
  
  // Check saved free access state or URL parameter
  const hasFreeAccess = 
    localStorage.getItem('freeAccessEnabled') === 'true' || 
    freeAccessParam;
  
  // If URL parameter is set, save the preference
  if (freeAccessParam) {
    localStorage.setItem('freeAccessEnabled', 'true');
  }
  
  return hasFreeAccess;
};

/**
 * Explicit function to disable free access mode
 */
export const disableFreeAccess = (): void => {
  localStorage.removeItem('freeAccessEnabled');
};
