
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText } from "lucide-react";
import { NewEmployeeDialog } from "./NewEmployeeDialog";
import { EmployeeDossierGenerator } from "./employee/EmployeeDossierGenerator";
import { BatchEmployeeImport } from "./employee/BatchEmployeeImport";

export function HRHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Gente e Gestão</h2>
        <p className="text-muted-foreground">
          Gerencie seus colaboradores, recrutamento e todo o ciclo de vida do colaborador
        </p>
      </div>
      <div className="flex space-x-2">
        <BatchEmployeeImport />
        <EmployeeDossierGenerator />
        <NewEmployeeDialog />
      </div>
    </div>
  );
}
