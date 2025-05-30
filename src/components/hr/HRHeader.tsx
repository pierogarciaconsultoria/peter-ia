import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText } from "lucide-react";
import { NewEmployeeDialog } from "./NewEmployeeDialog";
import { EmployeeDossierGenerator } from "./employee/EmployeeDossierGenerator";
import { BatchEmployeeImport } from "./employee/BatchEmployeeImport";
import { useAuth } from "@/contexts/AuthContext";
export function HRHeader() {
  const {
    userCompany
  } = useAuth();
  return <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Gente e Gestão</h2>
        
      </div>
      <div className="flex space-x-2">
        <BatchEmployeeImport />
        <EmployeeDossierGenerator />
        <NewEmployeeDialog />
      </div>
    </div>;
}