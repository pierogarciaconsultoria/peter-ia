
/**
 * Utilitários para detectar se estamos no editor Lovable e conceder acesso especial para demonstração
 */

// Verifica se estamos no editor Lovable
export function isLovableEditor(): boolean {
  // Verificar se estamos em um ambiente do Lovable usando o URL
  const isInLovableIframe = window.location.hostname.includes('lovableproject.com');
  
  // Também verifica se há um parâmetro na URL ou no localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const hasEditorParam = urlParams.has('lovable_editor');
  
  // Verificar se temos alguma indicação no localStorage
  const hasStorageFlag = localStorage.getItem('lovableEditorAccess') === 'true';
  
  // Se detectado como editor, salvar no localStorage para sessões futuras
  if (isInLovableIframe || hasEditorParam) {
    localStorage.setItem('lovableEditorAccess', 'true');
  }
  
  return isInLovableIframe || hasEditorParam || hasStorageFlag;
}

// Verifica se estamos no editor Lovable com privilégios de super admin
export function isSuperAdminInLovable(): boolean {
  const isInLovable = isLovableEditor();
  
  // Verificar se há um parâmetro específico para acesso de admin na URL
  const urlParams = new URLSearchParams(window.location.search);
  const isMasterAdmin = urlParams.has('master_admin');
  
  // Se for admin_master, salvar no localStorage
  if (isMasterAdmin) {
    localStorage.setItem('lovableEditorAccess', 'true');
    localStorage.setItem('lovableSuperAdminAccess', 'true');
  }
  
  // Verificar se temos a flag no localStorage
  const hasStorageFlag = localStorage.getItem('lovableSuperAdminAccess') === 'true';
  
  return isInLovable && (isMasterAdmin || hasStorageFlag);
}

// Verifica se devemos conceder acesso gratuito para demonstração
export function shouldGrantFreeAccess(): boolean {
  // Verificar se há um parâmetro na URL para acesso gratuito
  const urlParams = new URLSearchParams(window.location.search);
  const hasFreeAccessParam = urlParams.has('free_access');
  
  // Verificar se temos alguma indicação no localStorage
  const hasStorageFlag = localStorage.getItem('freeAccessMode') === 'true';
  
  // Se detectado como acesso gratuito, salvar no localStorage
  if (hasFreeAccessParam) {
    localStorage.setItem('freeAccessMode', 'true');
  }
  
  // Para facilitar testes, podemos adicionar acesso gratuito por padrão no Lovable
  const isLovable = isLovableEditor();
  
  return hasFreeAccessParam || hasStorageFlag || isLovable;
}
