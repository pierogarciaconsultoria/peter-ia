
import { Building, Pencil, Trash2, Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Department } from "@/hooks/useDepartments";

interface DepartmentTableProps {
  departments: Department[];
  onEditDepartment: (department: Department) => void;
  onDeleteDepartment: (department: Department) => void;
}

export function DepartmentTable({
  departments,
  onEditDepartment,
  onDeleteDepartment,
}: DepartmentTableProps) {
  const calculateHeadcountProgress = (current: number, approved: number) => {
    if (approved === 0) return 0;
    return Math.min(Math.round((current / approved) * 100), 100);
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Setor</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead>Quadro Aprovado</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments.map((department) => (
            <TableRow key={department.id}>
              <TableCell>
                <div className="font-medium">{department.name}</div>
                {department.description && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {department.description}
                  </div>
                )}
              </TableCell>
              <TableCell>
                {department.sector ? (
                  <Badge variant="outline">{department.sector}</Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">Não definido</span>
                )}
              </TableCell>
              <TableCell>
                {department.responsible_name || (
                  <span className="text-muted-foreground text-sm">Não definido</span>
                )}
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span>
                        {department.current_headcount} / {department.approved_headcount || 0}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {calculateHeadcountProgress(
                        department.current_headcount || 0, 
                        department.approved_headcount || 0
                      )}%
                    </span>
                  </div>
                  <Progress 
                    value={calculateHeadcountProgress(
                      department.current_headcount || 0, 
                      department.approved_headcount || 0
                    )} 
                    className="h-1.5"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditDepartment(department)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDeleteDepartment(department)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Excluir</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
