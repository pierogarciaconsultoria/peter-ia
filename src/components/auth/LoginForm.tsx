
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";
import { useLogin } from "@/hooks/useLogin";

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

  return (
    <form onSubmit={handleLogin}>
      <CardContent className="space-y-4">
        {errorDetails && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            {errorDetails}
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              placeholder="seu@email.com"
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
              className="pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
              className="pl-10"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Processando..." : "Entrar"}
        </Button>
        <Button 
          type="button"
          variant="outline"
          className="w-full mt-2"
          onClick={handleDirectAdminLogin}
          disabled={loading}
        >
          Entrar como Administrador
        </Button>
        <p className="text-xs text-muted-foreground text-center pt-2">
          Nota: Confirme se seu email e senha estão corretos. Em caso de dificuldades, tente recarregar a página.
        </p>
      </CardFooter>
    </form>
  );
};
