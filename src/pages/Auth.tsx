import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardHeader, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrainCircuit, Loader2 } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { shouldBypassAuth, isProductionEnvironment, setProductionAccessToken } from "@/utils/lovableEditorDetection";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAdminCreation } from "@/hooks/useAdminCreation";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, connectionStatus, reconnect } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const [accessToken, setAccessToken] = useState("");
  const [isSubmittingToken, setIsSubmittingToken] = useState(false);
  
  // Initialize the admin user
  useAdminCreation();
  
  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";
  
  // In production, bypass auth is much more restricted
  const bypassAuth = shouldBypassAuth();
  
  // When user is already logged in, redirect to dashboard or requested page
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);
  
  // If special access is granted in production (much more restricted)
  useEffect(() => {
    if (bypassAuth && isProductionEnvironment()) {
      navigate("/dashboard");
    }
  }, [bypassAuth, navigate]);

  // Handle production access token submission
  const handleAccessTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingToken(true);
    
    try {
      if (accessToken.length > 8) {
        // Set the token in local storage
        setProductionAccessToken(accessToken);
        toast.success("Token de acesso aceito", {
          description: "Redirecionando para o dashboard..."
        });
        
        // Small delay for UX before redirecting
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        toast.error("Token inválido", {
          description: "O token de acesso deve ter pelo menos 8 caracteres."
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
  if (isProductionEnvironment() && !bypassAuth) {
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
  
  // Standard auth form for development or non-production environments
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
