
/**
 * Utility to detect if the current session is running in Lovable editor
 * This grants unlimited access to all features without authentication
 * 
 * Detection methods:
 * 1. Check URL for master_admin parameter
 * 2. Check if running in development mode and inside an iframe
 * 3. Check if the hostname includes lovable.app
 * 4. Check for localStorage flags that might have been set
 */
export const isLovableEditor = (): boolean => {
  // Check multiple conditions to ensure robust detection
  return (
    // URL parameter check
    window.location.search.includes('master_admin=true') || 
    
    // Development + iframe check (most common for editor)
    (process.env.NODE_ENV === 'development' && window.self !== window.top) ||
    
    // Domain check
    window.location.hostname.includes('lovable.app') ||
    
    // Backup: check localStorage for a flag that might have been set
    localStorage.getItem('lovableEditorAccess') === 'true'
  );
};

// Set the localStorage flag to true to ensure persistence between refreshes
// This helps maintain editor access even if URL parameters change
if (isLovableEditor()) {
  localStorage.setItem('lovableEditorAccess', 'true');
  console.log("Lovable Editor detectado - acesso total concedido");
}
