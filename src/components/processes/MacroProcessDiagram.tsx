
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

interface MacroProcessDiagramProps {
  processes: any[];
}

export function MacroProcessDiagram({ processes }: MacroProcessDiagramProps) {
  const [processGroups, setProcessGroups] = useState<Record<string, any[]>>({});
  
  useEffect(() => {
    // Agrupa os processos por tipo
    const groups: Record<string, any[]> = {};
    processes.forEach(process => {
      const type = process.type || 'Não categorizado';
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(process);
    });
    setProcessGroups(groups);
  }, [processes]);

  if (processes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <p>Nenhum processo encontrado para gerar o diagrama.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(processGroups).map(([type, typeProcesses]) => (
        <Card key={type} className="overflow-hidden">
          <CardHeader className="bg-muted">
            <CardTitle>{type}</CardTitle>
            <CardDescription>
              {typeProcesses.length} processo(s) nesta categoria
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center flex-wrap gap-4">
              {typeProcesses.map((process, index) => (
                <React.Fragment key={process.id}>
                  <div className="border rounded-md p-4 bg-card min-w-[150px] text-center">
                    {process.name}
                  </div>
                  {index < typeProcesses.length - 1 && (
                    <ChevronRight className="text-muted-foreground" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
