
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const LoadingState = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Verificando link...</CardTitle>
        <CardDescription>Estamos validando o seu link de acesso.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center py-10">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-gray-300 mb-4"></div>
          <div className="h-4 w-48 bg-gray-300 rounded mb-2"></div>
          <div className="h-3 w-32 bg-gray-300 rounded"></div>
        </div>
      </CardContent>
    </Card>
  );
};
