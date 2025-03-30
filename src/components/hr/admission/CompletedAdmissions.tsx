
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { AdmissionProcess } from "./types";
import { getStatusBadge } from "./StatusBadge";

interface CompletedAdmissionsProps {
  admissionProcesses: AdmissionProcess[];
}

export function CompletedAdmissions({ admissionProcesses }: CompletedAdmissionsProps) {
  const completedProcesses = admissionProcesses.filter(p => p.status === "contrato_assinado");
  
  if (completedProcesses.length === 0) {
    return (
      <div className="text-center py-6">
        <Loader2 className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
        <p className="mt-2 text-muted-foreground">Nenhuma admissão concluída recentemente</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {completedProcesses.map(process => (
        <Card key={process.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{process.name}</CardTitle>
            <CardDescription>{process.position}</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Status:</span>
              <span>{getStatusBadge(process.status)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Data de Início:</span>
              <span className="text-sm">{new Date(process.startDate).toLocaleDateString('pt-BR')}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              Ver Documentos
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
