
import { Building } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyDepartmentState } from "./EmptyDepartmentState";
import { DepartmentTable } from "./DepartmentTable";
import { Department } from "@/hooks/useDepartments";

interface DepartmentListCardProps {
  departments: Department[];
  isLoading: boolean;
  onEditDepartment: (department: Department) => void;
  onDeleteDepartment: (department: Department) => void;
  onAddDepartment: () => void;
}

export function DepartmentListCard({
  departments,
  isLoading,
  onEditDepartment,
  onDeleteDepartment,
  onAddDepartment,
}: DepartmentListCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building className="mr-2 h-5 w-5" />
          Lista de Departamentos
        </CardTitle>
        <CardDescription>
          Visualize e gerencie todos os departamentos da empresa
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <p className="text-muted-foreground">Carregando departamentos...</p>
          </div>
        ) : departments.length === 0 ? (
          <EmptyDepartmentState onAddDepartment={onAddDepartment} />
        ) : (
          <DepartmentTable
            departments={departments}
            onEditDepartment={onEditDepartment}
            onDeleteDepartment={onDeleteDepartment}
          />
        )}
      </CardContent>
    </Card>
  );
}
