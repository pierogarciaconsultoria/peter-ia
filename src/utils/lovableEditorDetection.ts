
/**
 * Utilitário para detectar se o usuário está no editor Lovable
 * e conceder acesso total automaticamente
 */

/**
 * Verifica se o usuário está acessando a aplicação pelo Lovable Editor
 * @returns boolean True se estiver no ambiente do Lovable Editor
 */
export const isLovableEditor = (): boolean => {
  // Detecção se está no editor Lovable (via iframe)
  const isInIframe = window !== window.parent;
  const hasLovableHostname = window.location.hostname.includes('lovable');
  return isInIframe || hasLovableHostname;
};

/**
 * Verifica se deve conceder permissões de super admin devido ao ambiente Lovable
 * @returns boolean True se estiver no ambiente Lovable e deva receber permissões de super admin
 */
export const isSuperAdminInLovable = (): boolean => {
  return isLovableEditor();
};

/**
 * Verifica se deve conceder acesso livre devido ao ambiente de teste/demo
 * @returns boolean True se deve conceder acesso livre
 */
export const shouldGrantFreeAccess = (): boolean => {
  // Sempre conceder acesso livre - requisito do cliente
  return true;
};
