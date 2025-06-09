
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, AlertCircle, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Home = () => {
  const navigate = useNavigate();
  const { user, loading, hasAuthError, clearAuthError, connectionStatus } = useAuth();
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    // Aguardar um tempo antes de mostrar o fallback
    const fallbackTimer = setTimeout(() => {
      setShowFallback(true);
    }, 3000);

    // Se não estiver carregando e tiver usuário, redirecionar para dashboard
    if (!loading && user) {
      clearTimeout(fallbackTimer);
      navigate("/dashboard", { replace: true });
      return;
    }

    return () => clearTimeout(fallbackTimer);
  }, [user, loading, navigate]);

  // Mostrar loading inicial
  if (loading && !showFallback) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Carregando Peter.IA</h2>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se há erro de autenticação ou problemas de conexão, mostrar fallback
  if (hasAuthError || connectionStatus === 'disconnected' || showFallback) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">Peter.IA</CardTitle>
            <CardDescription>Sistema de Gestão da Qualidade</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {hasAuthError && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Problema de autenticação detectado. Tente fazer login novamente.
                </AlertDescription>
              </Alert>
            )}
            
            {connectionStatus === 'disconnected' && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Problema de conexão. Verifique sua internet e tente novamente.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <Button 
                onClick={() => navigate("/auth")}
                className="w-full"
                size="lg"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Fazer Login
              </Button>
              
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full"
              >
                Tentar Novamente
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Acesse todas as funcionalidades do Peter.IA:
              </p>
              <ul className="text-xs text-gray-500 mt-2 space-y-1">
                <li>• Dashboard e Indicadores</li>
                <li>• Gestão de Processos</li>
                <li>• Plano de Ação</li>
                <li>• Recursos Humanos</li>
                <li>• ISO 9001:2015</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Se chegou até aqui sem usuário, mostrar página de boas-vindas
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Bem-vindo ao Peter.IA</CardTitle>
          <CardDescription>Seu assistente inteligente para Gestão da Qualidade</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => navigate("/auth")}
            className="w-full"
            size="lg"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Entrar na Plataforma
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
