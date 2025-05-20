
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

/**
 * Verifica se estamos no ambiente do editor Lovable
 * Útil para personalizar comportamentos quando estiver no editor
 */
export function isLovableEditor(): boolean {
  // Verificar se estamos em ambiente de desenvolvimento
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Verificar se temos algum parâmetro específico do Lovable na URL
  const hasLovableParam = typeof window !== 'undefined' && 
    (new URLSearchParams(window.location.search).has('lovable') || 
     window.location.hostname.includes('lovable.app'));
  
  // Verificar se foi marcado no localStorage
  const hasLovableStorage = typeof localStorage !== 'undefined' && 
    localStorage.getItem('lovable_editor') === 'true';
  
  return isDevelopment || hasLovableParam || hasLovableStorage;
}

/**
 * Verifica se devemos conceder acesso livre/gratuito para demonstração
 * Combinação de várias verificações para garantir acesso em ambiente de desenvolvimento
 */
export function shouldGrantFreeAccess(): boolean {
  // Verifica se estamos no editor Lovable
  const isEditor = isLovableEditor();
  
  // Verificar parâmetros de URL específicos para acesso livre
  const hasFreeAccessParam = typeof window !== 'undefined' && 
    (new URLSearchParams(window.location.search).has('freeAccess') || 
     new URLSearchParams(window.location.search).has('demo'));
  
  // Verificar localStorage para acesso livre
  const hasFreeAccessStorage = typeof localStorage !== 'undefined' && 
    (localStorage.getItem('sgq_free_access') === 'true' || 
     localStorage.getItem('demo_access') === 'true');
  
  return isEditor || hasFreeAccessParam || hasFreeAccessStorage || isSuperAdminInLovable();
}

/**
 * Função centralizada que verifica se o usuário deve ter acesso sem autenticação
 * Consolida todas as verificações anteriores em uma única chamada
 */
export function shouldBypassAuth(): boolean {
  return isLovableEditor() || isSuperAdminInLovable() || shouldGrantFreeAccess();
}
