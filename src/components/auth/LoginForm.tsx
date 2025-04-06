
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { useLogin } from "@/hooks/useLogin";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
  const { loading, handleDirectAdminLogin } = useLogin();
  const navigate = useNavigate();
  
  // Check for Lovable editor access
  const isLovableEditor = 
    window.location.search.includes('master_admin=true') || 
    (process.env.NODE_ENV === 'development' && window.self !== window.top);

  return (
    <div>
      <CardContent className="space-y-4">
        <div className={`p-3 ${isLovableEditor ? "bg-green-50 border-green-200 text-green-600" : "bg-yellow-50 border-yellow-200 text-yellow-600"} border rounded-md text-sm`}>
          {isLovableEditor ? (
            "Acesso Master Admin detectado! Você pode acessar todas as funcionalidades do sistema via Lovable Editor."
          ) : (
            "A funcionalidade de login está temporariamente desativada."
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        {isLovableEditor ? (
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
          {isLovableEditor ? 
            "Você está usando o acesso Master Admin via Lovable Editor." : 
            "Entre em contato com o suporte para mais informações."}
        </p>
      </CardFooter>
    </div>
  );
};
