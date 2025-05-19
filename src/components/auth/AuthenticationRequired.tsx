
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

// Flag para desabilitar temporariamente a autenticação
const BYPASS_AUTH_TEMPORARILY = true;

interface AuthenticationRequiredProps {
  children: React.ReactNode;
}

export function AuthenticationRequired({ children }: AuthenticationRequiredProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Ignorar verificação de autenticação quando o bypass está habilitado
    if (BYPASS_AUTH_TEMPORARILY) {
      return;
    }
    
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Contornar verificação de autenticação se estiver temporariamente desabilitada
  if (BYPASS_AUTH_TEMPORARILY || user) {
    return <>{children}</>;
  }

  return null;
}
