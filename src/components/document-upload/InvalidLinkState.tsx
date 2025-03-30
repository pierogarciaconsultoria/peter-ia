
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const InvalidLinkState = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader className="bg-red-50">
        <CardTitle className="flex items-center text-red-700">
          <AlertCircle className="mr-2 h-5 w-5" />
          Link inválido ou expirado
        </CardTitle>
        <CardDescription className="text-red-600">
          O link que você está tentando acessar é inválido ou já foi utilizado.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <p>Por favor, entre em contato com o RH para obter um novo link.</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => navigate("/")}>Voltar para a página inicial</Button>
      </CardFooter>
    </Card>
  );
};
