
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export function AdmissionInterview() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Entrevistas de Admissão</h2>
        <Button>Nova Entrevista</Button>
      </div>
      
      <Card className="p-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Módulo em desenvolvimento</AlertTitle>
          <AlertDescription>
            O módulo de Entrevista de Admissão está em desenvolvimento. Em breve você poderá gerenciar suas entrevistas de admissão aqui.
          </AlertDescription>
        </Alert>
      </Card>
    </div>
  );
}
