
/**
 * Utility to detect if the current session is running in Lovable editor
 * This grants unlimited access to all features without authentication
 */
export const isLovableEditor = (): boolean => {
  return (
    window.location.search.includes('master_admin=true') || 
    (process.env.NODE_ENV === 'development' && window.self !== window.top) ||
    window.location.hostname.includes('lovable.app')
  );
};
