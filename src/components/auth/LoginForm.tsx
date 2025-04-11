
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { useLogin } from "@/hooks/useLogin";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { isLovableEditor, shouldGrantFreeAccess, getEnvironmentInfo } from "@/utils/lovableEditorDetection";

export const LoginForm = () => {
  const { loading, handleDirectAdminLogin, isFreeAccessEnabled } = useLogin();
  const navigate = useNavigate();
  
  // Use the centralized Lovable editor detection
  const isEditor = isLovableEditor();
  // Verifica se é modo de acesso gratuito
  const isFreeAccess = shouldGrantFreeAccess();
  // Obtém informações sobre o ambiente atual
  const environmentInfo = getEnvironmentInfo();

  // If in Lovable editor or free access mode, automatically redirect to dashboard
  useEffect(() => {
    if (isEditor || isFreeAccess) {
      console.log(`Acesso total concedido - redirecionando para dashboard (${environmentInfo})`);
      navigate("/");
    }
  }, [isEditor, isFreeAccess, navigate]);
  
  // If in Lovable editor or free access mode, don't render login form at all
  if (isEditor || isFreeAccess) {
    return null;
  }

  return (
    <div>
      <CardContent className="space-y-4">
        <div className={`p-3 ${isEditor ? "bg-green-50 border-green-200 text-green-600" : "bg-yellow-50 border-yellow-200 text-yellow-600"} border rounded-md text-sm`}>
          {isEditor ? (
            "Acesso total concedido! Você pode acessar todas as funcionalidades do sistema via Lovable Editor."
          ) : (
            "A funcionalidade de login está temporariamente desativada."
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        {isEditor ? (
          <>
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
          </>
        ) : (
          <Button
            type="button"
            className="w-full"
            disabled={true}
          >
            Login Desativado
          </Button>
        )}
        <p className="text-xs text-muted-foreground text-center pt-2">
          {isEditor ? 
            `Você está usando o acesso total via Lovable Editor (${environmentInfo}).` : 
            "Entre em contato com o suporte para mais informações."}
        </p>
      </CardFooter>
    </div>
  );
};
