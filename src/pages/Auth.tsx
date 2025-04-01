
import { Card, CardContent } from "@/components/ui/card";

const Auth = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Gestão</h1>
          <p className="text-muted-foreground">Simplifique a conformidade</p>
        </div>
        
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <h2 className="text-xl font-medium mb-4">Página de autenticação desativada</h2>
              <p className="text-muted-foreground">
                A funcionalidade de autenticação foi temporariamente desativada.
                Por favor, entre em contato com o suporte para mais informações.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
