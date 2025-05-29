
import { useState } from "react";
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
import { EmployeeDetailsModal } from "./EmployeeDetailsModal";
import { EditEmployeeModal } from "./EditEmployeeModal";
import { DeleteEmployeeDialog } from "./DeleteEmployeeDialog";

type EmployeeRowProps = {
  employee: Employee;
  formatDate: (dateString: string) => string;
};

export function EmployeeRow({ employee, formatDate }: EmployeeRowProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
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
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setDetailsOpen(true)}>
                <Eye className="mr-2 h-4 w-4" />
                <span>Visualizar</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Editar</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-600"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Excluir</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {/* Modais */}
      <EmployeeDetailsModal
        employee={employee}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        formatDate={formatDate}
      />
      
      <EditEmployeeModal
        employee={employee}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      
      <DeleteEmployeeDialog
        employee={employee}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
