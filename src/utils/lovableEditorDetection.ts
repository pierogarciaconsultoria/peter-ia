
/**
 * Utilitários para detectar se o usuário está no Lovable Editor
 * e conceder privilégios específicos quando necessário
 */

// Verifica se o usuário está acessando o aplicativo pelo Lovable Editor
export function isLovableEditor(): boolean {
  // Verifica o URL para parâmetros específicos do ambiente Lovable
  const url = new URL(window.location.href);
  const hasLovableParam = url.searchParams.has('master_admin');
  
  // Verifica localStorage para persistência do status de editor
  const storedEditorStatus = localStorage.getItem('lovableEditorAccess') === 'true';
  
  // Se detectado como editor pela primeira vez, salva no localStorage
  if (hasLovableParam && !storedEditorStatus) {
    localStorage.setItem('lovableEditorAccess', 'true');
    console.log("Modo Lovable Editor detectado e armazenado");
  }
  
  return hasLovableParam || storedEditorStatus;
}

// Verifica se o usuário deve ter privilégios de super admin no Lovable Editor
export function isSuperAdminInLovable(): boolean {
  const isEditor = isLovableEditor();
  
  if (isEditor) {
    // Registra no console para debugging
    console.log("Acesso de super administrador concedido via Lovable Editor");
  }
  
  return isEditor;
}
