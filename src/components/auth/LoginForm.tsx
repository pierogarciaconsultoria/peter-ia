
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { useLogin } from "@/hooks/useLogin";

export const LoginForm = () => {
  const { loading } = useLogin();

  return (
    <div>
      <CardContent className="space-y-4">
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-600 text-sm">
          A funcionalidade de login está temporariamente desativada.
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button
          type="button"
          className="w-full"
          disabled={true}
        >
          Login Desativado
        </Button>
        <p className="text-xs text-muted-foreground text-center pt-2">
          Entre em contato com o suporte para mais informações.
        </p>
      </CardFooter>
    </div>
  );
};
