
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

interface EmptyDiscAssessmentProps {
  onCreateAssessment: () => void;
}

export function EmptyDiscAssessment({ onCreateAssessment }: EmptyDiscAssessmentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nenhuma avaliação DISC encontrada</CardTitle>
        <CardDescription>
          Realize sua primeira avaliação DISC para começar a análise de perfis comportamentais.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center pt-6 pb-8">
        <FileQuestion className="h-16 w-16 text-muted-foreground mb-6" />
        <p className="text-center text-muted-foreground max-w-md mb-6">
          A metodologia DISC é um poderoso instrumento de avaliação comportamental
          que ajuda a identificar os diferentes estilos de comportamento e comunicação das pessoas.
        </p>
        <Button onClick={onCreateAssessment}>
          Realizar Primeira Avaliação
        </Button>
      </CardContent>
    </Card>
  );
}
