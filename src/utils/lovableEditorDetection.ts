
/**
 * Detecta se o usuário está acessando via Lovable Editor
 * @returns {boolean}
 */
export function isLovableEditor(): boolean {
  // Verifica se está no ambiente de desenvolvimento do Lovable
  const isInLovable = typeof window !== 'undefined' && 
    (window.location.hostname.includes('lovable.dev') || 
     window.location.hostname.includes('lovable.app') ||
     window.location.hostname === 'localhost');

  if (!isInLovable) return false;
  
  // Verifica também localStorage para acesso persistente via Lovable
  try {
    const hasLocalStorageAccess = localStorage.getItem('lovableEditorAccess') === 'true';
    if (hasLocalStorageAccess) return true;
  } catch (e) {
    // Em caso de erro de acesso ao localStorage (ex: cookies desativados)
    console.error("Erro ao acessar localStorage:", e);
  }
  
  // Verifica se estamos em um contexto onde o editor está ativo
  // (Esta é uma detecção simples, pode ser aprimorada conforme necessário)
  return typeof window !== 'undefined' && 
    (window.parent !== window || 
     document.referrer.includes('lovable.dev') || 
     document.referrer.includes('lovable.app'));
}

/**
 * Verifica se o usuário deve ter acesso super admin via Lovable Editor
 * @returns {boolean}
 */
export function isSuperAdminInLovable(): boolean {
  // Se não estiver no Lovable Editor, não é super admin
  if (!isLovableEditor()) return false;
  
  // Verifica o parâmetro master_admin na URL
  const urlParams = new URLSearchParams(
    typeof window !== 'undefined' ? window.location.search : ''
  );
  
  const isMasterAdminUrl = urlParams.get('master_admin') === 'true';
  
  // Verifica também localStorage para acesso persistente
  let hasStorageAccess = false;
  try {
    hasStorageAccess = localStorage.getItem('lovableEditorAccess') === 'true';
    
    // Salva no localStorage se vier via URL para persistir entre páginas
    if (isMasterAdminUrl && !hasStorageAccess) {
      localStorage.setItem('lovableEditorAccess', 'true');
      hasStorageAccess = true;
    }
  } catch (e) {
    console.error("Erro ao acessar localStorage:", e);
  }
  
  return isMasterAdminUrl || hasStorageAccess;
}

/**
 * Verifica se deve conceder acesso gratuito para testes
 * @returns {boolean}
 */
export function shouldGrantFreeAccess(): boolean {
  // Verifica o parâmetro free_access na URL
  const urlParams = new URLSearchParams(
    typeof window !== 'undefined' ? window.location.search : ''
  );
  
  const isFreeAccessUrl = urlParams.get('free_access') === 'true';
  
  // Verifica a existência de uma variável de ambiente (para dev local)
  const hasEnvAccess = import.meta.env.VITE_FREE_ACCESS === 'true';
  
  // Verifica também localStorage para acesso persistente
  let hasStorageAccess = false;
  try {
    hasStorageAccess = localStorage.getItem('freeAccessEnabled') === 'true';
    
    // Salva no localStorage se vier via URL para persistir entre páginas
    if (isFreeAccessUrl && !hasStorageAccess) {
      localStorage.setItem('freeAccessEnabled', 'true');
      hasStorageAccess = true;
    }
  } catch (e) {
    console.error("Erro ao acessar localStorage:", e);
  }
  
  return isFreeAccessUrl || hasEnvAccess || hasStorageAccess;
}
