
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { useLogin } from "@/hooks/useLogin";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { isLovableEditor, shouldGrantFreeAccess } from "@/utils/lovableEditorDetection";

// Flag para desabilitar temporariamente a autenticação
const BYPASS_AUTH_TEMPORARILY = true;

export const LoginForm = () => {
  const {
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    loading,
    errorDetails,
    handleLogin,
    handleDirectAdminLogin
  } = useLogin();
  const navigate = useNavigate();
  
  // Use the centralized Lovable editor detection
  const isEditor = isLovableEditor();
  // Verifica se é modo de acesso gratuito
  const isFreeAccess = shouldGrantFreeAccess();

  if (isEditor || isFreeAccess || BYPASS_AUTH_TEMPORARILY) {
    return (
      <div>
        <CardContent className="space-y-4">
          <div className={`p-3 ${isEditor ? "bg-green-50 border-green-200 text-green-600" : "bg-yellow-50 border-yellow-200 text-yellow-600"} border rounded-md text-sm`}>
            {BYPASS_AUTH_TEMPORARILY ? (
              "Autenticação temporariamente desabilitada. Você será automaticamente autenticado."
            ) : isEditor ? (
              "Acesso total concedido! Você pode acessar todas as funcionalidades do sistema via Lovable Editor."
            ) : (
              "Acesso gratuito concedido! Você pode usar todas as funcionalidades do sistema no modo demonstração."
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button
            type="button" 
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={() => navigate("/")}
          >
            Acessar Dashboard
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleDirectAdminLogin}
          >
            Acessar Área Administrativa
          </Button>
        </CardFooter>
      </div>
    );
  }

  return (
    <form onSubmit={handleLogin}>
      <CardContent className="space-y-4">
        {errorDetails && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {errorDetails}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="seu@email.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            required
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <a href="#" className="text-xs text-primary hover:underline">
              Esqueceu a senha?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
        </div>
      </CardContent>
      
      <CardFooter>
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Entrando...
            </>
          ) : (
            "Entrar"
          )}
        </Button>
      </CardFooter>
    </form>
  );
};
