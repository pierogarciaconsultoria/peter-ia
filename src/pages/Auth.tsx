import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardHeader, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrainCircuit, Loader2 } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { shouldBypassAuth, isProductionEnvironment, setProductionAccessToken, isLovableEditor } from "@/utils/lovableEditorDetection";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Agora o useAuth deve funcionar porque está dentro do AuthProvider
  const { user, loading, connectionStatus, reconnect } = useAuth();
  
  const [activeTab, setActiveTab] = useState("login");
  const [accessToken, setAccessToken] = useState("");
  const [isSubmittingToken, setIsSubmittingToken] = useState(false);
  
  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";
  
  // Check environment and access status
  const bypassAuth = shouldBypassAuth();
  const isProduction = isProductionEnvironment();
  const isInLovable = isLovableEditor();
  
  // Debug logging
  useEffect(() => {
    console.log('Auth page debug info:', {
      bypassAuth,
      isProduction,
      isInLovable,
      user: !!user,
      hostname: window.location.hostname,
      nodeEnv: process.env.NODE_ENV
    });
  }, [bypassAuth, isProduction, isInLovable, user]);
  
  // When user is already logged in, redirect to dashboard or requested page
  useEffect(() => {
    if (user) {
      console.log('User authenticated, redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);
  
  // If bypass auth is granted, redirect immediately
  useEffect(() => {
    if (bypassAuth) {
      console.log('Auth bypass granted, redirecting to dashboard');
      toast.success("Acesso especial concedido", {
        description: "Redirecionando para o dashboard..."
      });
      navigate("/dashboard");
    }
  }, [bypassAuth, navigate]);

  // Handle production access token submission
  const handleAccessTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingToken(true);
    
    try {
      if (accessToken.length > 4) { // More permissive
        setProductionAccessToken(accessToken);
        toast.success("Token de acesso aceito", {
          description: "Redirecionando para o dashboard..."
        });
        
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        toast.error("Token inválido", {
          description: "O token de acesso deve ter pelo menos 4 caracteres."
        });
      }
    } catch (error) {
      toast.error("Erro ao processar token", {
        description: "Ocorreu um erro ao processar o token de acesso."
      });
    } finally {
      setIsSubmittingToken(false);
    }
  };
  
  // Show connection error if disconnected
  if (connectionStatus === 'disconnected' && !bypassAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <Card className="border-red-200">
            <CardHeader className="text-center">
              <CardTitle className="text-red-600">Problema de Conexão</CardTitle>
              <CardDescription>
                Não foi possível conectar ao servidor. Verifique sua conexão com a internet.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button 
                onClick={() => reconnect()}
                className="w-full"
                variant="destructive"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Tentar novamente
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
  
  // Show loading spinner when checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mt-2 text-sm text-muted-foreground">Carregando...</span>
      </div>
    );
  }
  
  // In production environment with no access, show production token input
  // But be more permissive - only show this if we're actually in production AND not in Lovable
  if (isProduction && !bypassAuth && !isInLovable) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BrainCircuit className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Peter.IA</h1>
            </div>
            <p className="text-muted-foreground">Gestão Inteligente para Empresas</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Acesso à Produção</CardTitle>
              <CardDescription className="text-center">
                Digite seu token de acesso para entrar no ambiente de produção
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleAccessTokenSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accessToken">Token de Acesso</Label>
                  <Input
                    id="accessToken"
                    placeholder="Digite seu token de acesso"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    required
                  />
                </div>
                {/* Debug info for development */}
                {!isProduction && (
                  <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
                    Debug: isProduction={isProduction.toString()}, isInLovable={isInLovable.toString()}, bypassAuth={bypassAuth.toString()}
                  </div>
                )}
              </CardContent>
              
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmittingToken}
                >
                  {isSubmittingToken ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    "Acessar"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    );
  }
  
  // Standard auth form for development or Lovable environments
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BrainCircuit className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Peter.IA</h1>
          </div>
          <p className="text-muted-foreground">Gestão Inteligente para Empresas</p>
        </div>
        
        <Card>
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <CardHeader>
              <div className="flex justify-center">
                <TabsList className="grid w-full max-w-xs grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Cadastro</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            
            <CardContent>
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              
              <TabsContent value="register">
                <RegisterForm setActiveTab={setActiveTab} />
              </TabsContent>
            </CardContent>
            
            <CardFooter>
              <p className="text-center text-sm text-muted-foreground w-full">
                Ao continuar, você concorda com nossos{" "}
                <a href="#" className="text-primary hover:underline">
                  Termos de Serviço
                </a>{" "}
                e{" "}
                <a href="#" className="text-primary hover:underline">
                  Política de Privacidade
                </a>
                .
              </p>
            </CardFooter>
          </Tabs>
        </Card>
        
        <div className="mt-4 text-center">
          <button 
            className="text-sm text-muted-foreground hover:text-primary hover:underline"
            onClick={() => navigate("/")}
          >
            Voltar para a página inicial
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
