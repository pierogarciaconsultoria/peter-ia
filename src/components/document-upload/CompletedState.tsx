
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CompletedStateProps {
  employeeName: string;
}

export const CompletedState = ({ employeeName }: CompletedStateProps) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader className="bg-green-50">
        <CardTitle className="flex items-center text-green-700">
          <CheckCircle className="mr-2 h-5 w-5" />
          Documentos enviados com sucesso!
        </CardTitle>
        <CardDescription className="text-green-600">
          Todos os documentos foram recebidos e estão em processo de verificação.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <p>Obrigado por enviar seus documentos, {employeeName}. O departamento de RH entrará em contato caso seja necessário mais alguma informação.</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => navigate("/")}>Voltar para a página inicial</Button>
      </CardFooter>
    </Card>
  );
};
