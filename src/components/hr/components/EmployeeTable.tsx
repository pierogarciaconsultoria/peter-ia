
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { EmployeeRow } from "./EmployeeRow";
import { EmployeeTableSkeleton } from "./EmployeeTableSkeleton";
import { EmptyEmployeeState } from "./EmptyEmployeeState";
import { Employee } from "../types/employee";

type EmployeeTableProps = {
  employees: Employee[];
  formatDate: (dateString: string) => string;
  isLoading: boolean;
};

export function EmployeeTable({ employees, formatDate, isLoading }: EmployeeTableProps) {
  if (isLoading) {
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
            <EmployeeTableSkeleton />
          </TableBody>
        </Table>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="rounded-md border">
        <EmptyEmployeeState />
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
          {employees.map((employee) => (
            <EmployeeRow 
              key={employee.id} 
              employee={employee} 
              formatDate={formatDate}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
