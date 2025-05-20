
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { shouldBypassAuth } from '@/utils/lovableEditorDetection';

interface AuthenticationRequiredProps {
  children: React.ReactNode;
}

export function AuthenticationRequired({ children }: AuthenticationRequiredProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  // Verificar se devemos permitir acesso sem autenticação
  const bypassAuth = shouldBypassAuth();

  useEffect(() => {
    // Ignorar verificação de autenticação se o bypass está habilitado
    if (bypassAuth) {
      console.log("Autenticação ignorada: acesso especial concedido");
      return;
    }
    
    // Se não estiver carregando e não tiver usuário, redirecionar para página de login
    if (!loading && !user) {
      console.log("Usuário não autenticado. Redirecionando para /auth");
      navigate('/auth');
    }
  }, [user, loading, navigate, bypassAuth]);

  // Exibir indicador de carregamento enquanto verifica autenticação
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Permitir acesso se o usuário está autenticado ou se o bypass está habilitado
  if (bypassAuth || user) {
    return <>{children}</>;
  }

  return null;
}
