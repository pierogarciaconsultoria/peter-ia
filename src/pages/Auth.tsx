
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrainCircuit } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";

const Auth = () => {
  const navigate = useNavigate();
  
  // Check for Lovable editor access
  const isLovableEditor = 
    window.location.search.includes('master_admin=true') || 
    (process.env.NODE_ENV === 'development' && window.self !== window.top);
  
  // Immediately redirect to dashboard if in Lovable editor
  useEffect(() => {
    if (isLovableEditor) {
      navigate("/");
    }
  }, [isLovableEditor, navigate]);
  
  // If in Lovable editor, don't render the auth page at all
  if (isLovableEditor) {
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
            onClick={() => navigate("/landing")}
          >
            Voltar para a página inicial
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
