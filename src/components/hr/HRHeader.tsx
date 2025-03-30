
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, Plus, Upload } from "lucide-react";
import { NewEmployeeDialog } from "./NewEmployeeDialog";

export function HRHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">Gente e Gestão</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie sua equipe de forma eficiente
        </p>
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Importar
        </Button>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
        <Button variant="outline" size="sm">
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Relatórios
        </Button>
        <NewEmployeeDialog />
      </div>
    </div>
  );
}
