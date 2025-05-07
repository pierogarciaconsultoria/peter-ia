
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { EmployeeRow } from "./EmployeeRow";
import { Employee } from "../types/employee";

type EmployeeTableProps = {
  employees: Employee[];
  formatDate: (dateString: string) => string;
  isLoading: boolean;
};

export function EmployeeTable({ employees, formatDate, isLoading }: EmployeeTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-muted-foreground">Carregando funcionários...</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Funcionário</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data de Contratação</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Nenhum funcionário encontrado. Adicione ou gere dados de demonstração.
              </TableCell>
            </TableRow>
          ) : (
            employees.map((employee) => (
              <EmployeeRow 
                key={employee.id} 
                employee={employee} 
                formatDate={formatDate}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
