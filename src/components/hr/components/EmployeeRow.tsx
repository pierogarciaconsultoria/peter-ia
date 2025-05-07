
import { TableRow, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmployeeStatus } from "./EmployeeStatus";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Employee } from "../types/employee";

type EmployeeRowProps = {
  employee: Employee;
  formatDate: (dateString: string) => string;
};

export function EmployeeRow({ employee, formatDate }: EmployeeRowProps) {
  return (
    <TableRow key={employee.id}>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={employee.avatar_url || ""} />
            <AvatarFallback>{employee.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{employee.name}</span>
            <span className="text-xs text-muted-foreground">{employee.email}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>{employee.department}</TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span>{employee.position}</span>
          {employee.position_id && (
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">
                Cód: {employee.position_id}
              </span>
              {employee.position_details && (
                <span className="text-xs text-muted-foreground line-clamp-1">
                  {employee.position_details.description}
                </span>
              )}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell><EmployeeStatus status={employee.status} /></TableCell>
      <TableCell>{formatDate(employee.hire_date)}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              <span>Visualizar</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Editar</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Excluir</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
