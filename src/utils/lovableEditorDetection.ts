
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
 * Este modo é útil para demonstrações e testes, mas deve ser desativado em produção
 * para ambientes multi-empresa
 * @returns boolean True se deve conceder acesso livre
 */
export const shouldGrantFreeAccess = (): boolean => {
  // Para ambiente multi-empresa em produção, você deve modificar esta função
  // para retornar false ou verificar uma variável de ambiente específica
  
  // Exemplo de como implementar um controle mais fino:
  // const isProduction = process.env.NODE_ENV === 'production';
  // const hasFreeAccessOverride = localStorage.getItem('enable_free_access') === 'true';
  // return !isProduction || hasFreeAccessOverride || isLovableEditor();
  
  // Por enquanto, mantém o comportamento atual conforme requisito do cliente
  return true;
};

/**
 * Verifica o tipo de ambiente para debug e diagnóstico
 * Útil para depuração em ambientes multi-empresa
 * @returns string Descrição do ambiente atual
 */
export const getEnvironmentInfo = (): string => {
  const isEditor = isLovableEditor();
  const isFreeAccess = shouldGrantFreeAccess();
  
  if (isEditor) {
    return "Ambiente Lovable Editor (acesso total)";
  } else if (isFreeAccess) {
    return "Modo de acesso livre (demo/teste)";
  } else {
    return "Ambiente de produção (acesso controlado)";
  }
};
