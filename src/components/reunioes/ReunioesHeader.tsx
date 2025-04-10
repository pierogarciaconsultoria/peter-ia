
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText } from "lucide-react";
import { NovaReuniaoDialog } from "./NovaReuniaoDialog";
import { ExportarRelatorioReuniao } from "./ExportarRelatorioReuniao";

export function ReunioesHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Reuniões</h2>
        <p className="text-muted-foreground">
          Gerencie reuniões e acompanhe atividades da equipe
        </p>
      </div>
      
      <div className="flex space-x-2">
        <ExportarRelatorioReuniao />
        <NovaReuniaoDialog />
      </div>
    </div>
  );
}
