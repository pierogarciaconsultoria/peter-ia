
/**
 * Utilitários para detectar se estamos no editor Lovable e conceder acesso especial para demonstração
 */

// Variáveis de estado compartilhadas
const AUTH_STORAGE_KEYS = {
  EDITOR_ACCESS: 'lovableEditorAccess',
  SUPER_ADMIN_ACCESS: 'lovableSuperAdminAccess',
  FREE_ACCESS_MODE: 'freeAccessMode'
};

/**
 * Verifica se estamos no editor Lovable
 * Útil para personalizar comportamentos quando estiver no editor
 */
export function isLovableEditor(): boolean {
  // Verificar se estamos em um ambiente do Lovable usando o URL
  const isInLovableIframe = typeof window !== 'undefined' && 
    (window.location.hostname.includes('lovableproject.com') || 
     window.location.hostname.includes('lovable.app'));
  
  // Também verifica se há um parâmetro na URL ou no localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const hasEditorParam = urlParams.has('lovable_editor');
  
  // Verificar se temos alguma indicação no localStorage
  const hasStorageFlag = localStorage.getItem(AUTH_STORAGE_KEYS.EDITOR_ACCESS) === 'true';
  
  // Se detectado como editor, salvar no localStorage para sessões futuras
  if (isInLovableIframe || hasEditorParam) {
    localStorage.setItem(AUTH_STORAGE_KEYS.EDITOR_ACCESS, 'true');
  }
  
  return isInLovableIframe || hasEditorParam || hasStorageFlag;
}

/**
 * Verifica se estamos no editor Lovable com privilégios de super admin
 */
export function isSuperAdminInLovable(): boolean {
  const isInLovable = isLovableEditor();
  
  // Verificar se há um parâmetro específico para acesso de admin na URL
  const urlParams = new URLSearchParams(window.location.search);
  const isMasterAdmin = urlParams.has('master_admin');
  
  // Se for admin_master, salvar no localStorage
  if (isMasterAdmin) {
    localStorage.setItem(AUTH_STORAGE_KEYS.EDITOR_ACCESS, 'true');
    localStorage.setItem(AUTH_STORAGE_KEYS.SUPER_ADMIN_ACCESS, 'true');
  }
  
  // Verificar se temos a flag no localStorage
  const hasStorageFlag = localStorage.getItem(AUTH_STORAGE_KEYS.SUPER_ADMIN_ACCESS) === 'true';
  
  return isInLovable && (isMasterAdmin || hasStorageFlag);
}

/**
 * Verifica se devemos conceder acesso gratuito para demonstração
 */
export function shouldGrantFreeAccess(): boolean {
  // Verificar se há um parâmetro na URL para acesso gratuito
  const urlParams = new URLSearchParams(window.location.search);
  const hasFreeAccessParam = urlParams.has('free_access');
  
  // Verificar se temos alguma indicação no localStorage
  const hasStorageFlag = localStorage.getItem(AUTH_STORAGE_KEYS.FREE_ACCESS_MODE) === 'true';
  
  // Se detectado como acesso gratuito, salvar no localStorage
  if (hasFreeAccessParam) {
    localStorage.setItem(AUTH_STORAGE_KEYS.FREE_ACCESS_MODE, 'true');
  }
  
  // Para facilitar testes, podemos adicionar acesso gratuito por padrão no Lovable
  const isLovable = isLovableEditor();
  
  return hasFreeAccessParam || hasStorageFlag || isLovable;
}

/**
 * Função centralizada que verifica se o usuário deve ter acesso sem autenticação
 * Esto consolida todas as verificações anteriores em uma única chamada
 */
export function shouldBypassAuth(): boolean {
  return isLovableEditor() || isSuperAdminInLovable() || shouldGrantFreeAccess();
}

/**
 * Limpar todas as flags de acesso especial
 * Útil para testes e depuração
 */
export function clearAccessFlags(): void {
  localStorage.removeItem(AUTH_STORAGE_KEYS.EDITOR_ACCESS);
  localStorage.removeItem(AUTH_STORAGE_KEYS.SUPER_ADMIN_ACCESS);
  localStorage.removeItem(AUTH_STORAGE_KEYS.FREE_ACCESS_MODE);
}
