
/**
 * Utility functions to detect Lovable Editor environment and enable free access mode
 */

/**
 * Checks if the current environment is the Lovable Editor
 * @returns boolean indicating if we're in the Lovable Editor
 */
export const isLovableEditor = (): boolean => {
  // Check if we're in the Lovable Editor by checking the URL or localStorage
  const isEditor = 
    window.location.hostname.includes('lovable.app') || 
    localStorage.getItem('lovableEditorAccess') === 'true';
  
  if (isEditor && localStorage.getItem('lovableEditorAccess') !== 'true') {
    localStorage.setItem('lovableEditorAccess', 'true');
  }
  
  return isEditor;
};

/**
 * Checks if we're running in a super admin context in the Lovable Editor
 * @returns boolean indicating if we're a super admin in the editor
 */
export const isSuperAdminInLovable = (): boolean => {
  return (
    isLovableEditor() || 
    window.location.search.includes('master_admin=true')
  );
};

/**
 * Checks if free access should be granted (for testing and demos)
 * @returns boolean indicating if free access should be granted
 */
export const shouldGrantFreeAccess = (): boolean => {
  // Grant free access if URL has free_access=true or in Lovable Editor
  const params = new URLSearchParams(window.location.search);
  const hasFreeAccessParam = params.get('free_access') === 'true';
  
  if (hasFreeAccessParam) {
    localStorage.setItem('freeAccessEnabled', 'true');
  }
  
  return (
    isLovableEditor() || 
    hasFreeAccessParam || 
    localStorage.getItem('freeAccessEnabled') === 'true'
  );
};
