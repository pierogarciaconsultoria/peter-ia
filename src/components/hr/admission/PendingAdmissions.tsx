
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck, Link as LinkIcon } from "lucide-react";
import { AdmissionProcess } from "./types";
import { getStatusBadge } from "./StatusBadge";

interface PendingAdmissionsProps {
  admissionProcesses: AdmissionProcess[];
  onSelectProcess: (id: string) => void;
}

export function PendingAdmissions({ admissionProcesses, onSelectProcess }: PendingAdmissionsProps) {
  const pendingProcesses = admissionProcesses.filter(p => p.status !== "contrato_assinado");

  if (pendingProcesses.length === 0) {
    return (
      <div className="text-center py-6">
        <FileCheck className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
        <p className="mt-2 text-muted-foreground">Não há processos pendentes</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pendingProcesses.map(process => (
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
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Progresso:</span>
              <span className="text-sm">{process.completion}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${process.completion}%` }}>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              Ver Detalhes
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center" 
              onClick={() => onSelectProcess(process.id)}
            >
              <LinkIcon className="h-3 w-3 mr-1" />
              Enviar Link
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
