
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrainCircuit, AlertTriangle } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { isLovableEditor, shouldGrantFreeAccess } from "@/utils/lovableEditorDetection";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Flag para desabilitar temporariamente a autenticação
const BYPASS_AUTH_TEMPORARILY = true;

const Auth = () => {
  const navigate = useNavigate();
  
  // Use the centralized Lovable editor detection
  const isEditor = isLovableEditor();
  // Verifica se é modo de acesso gratuito
  const isFreeAccess = shouldGrantFreeAccess();
  
  // Immediately redirect to dashboard if in Lovable editor or free access mode
  // or if authentication is temporarily disabled
  useEffect(() => {
    if (isEditor || isFreeAccess || BYPASS_AUTH_TEMPORARILY) {
      console.log("Acesso total concedido - redirecionando para dashboard");
      navigate("/");
    }
  }, [isEditor, isFreeAccess, navigate]);
  
  // If in Lovable editor or free access mode, don't render the auth page at all
  if (isEditor || isFreeAccess || BYPASS_AUTH_TEMPORARILY) {
    return null;
  }
  
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
        
        {BYPASS_AUTH_TEMPORARILY && (
          <Alert variant="warning" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-amber-600">
              Autenticação por email temporariamente desabilitada. Você será redirecionado...
            </AlertDescription>
          </Alert>
        )}
        
        <Card>
          <Tabs defaultValue="login">
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
                <RegisterForm setActiveTab={(tab) => {
                  const tabsElement = document.querySelector('[role="tablist"]');
                  if (tabsElement) {
                    const loginTab = tabsElement.querySelector(`[value="${tab}"]`);
                    if (loginTab) {
                      (loginTab as HTMLElement).click();
                    }
                  }
                }} />
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
