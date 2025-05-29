
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Employee } from "../types/employee";

interface EmployeeDetailsModalProps {
  employee: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formatDate: (dateString: string) => string;
}

export function EmployeeDetailsModal({ 
  employee, 
  open, 
  onOpenChange, 
  formatDate 
}: EmployeeDetailsModalProps) {
  if (!employee) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'on_leave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      case 'on_leave':
        return 'Em licença';
      default:
        return status;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Funcionário</DialogTitle>
          <DialogDescription>
            Informações completas do funcionário
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header com foto e nome */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={employee.avatar_url || ""} />
              <AvatarFallback className="text-lg">
                {employee.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{employee.name}</h3>
              <p className="text-muted-foreground">{employee.email}</p>
              <Badge className={getStatusColor(employee.status)}>
                {getStatusText(employee.status)}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Informações profissionais */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">
                Departamento
              </h4>
              <p className="font-medium">{employee.department}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">
                Cargo
              </h4>
              <p className="font-medium">{employee.position}</p>
            </div>
          </div>

          {employee.position_id && (
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">
                Código do Cargo
              </h4>
              <p className="font-medium">{employee.position_id}</p>
            </div>
          )}

          {employee.position_details && (
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">
                Descrição do Cargo
              </h4>
              <p className="text-sm">{employee.position_details.description}</p>
            </div>
          )}

          <Separator />

          {/* Informações de contato */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">
                Data de Contratação
              </h4>
              <p className="font-medium">{formatDate(employee.hire_date)}</p>
            </div>
            {employee.phone && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">
                  Telefone
                </h4>
                <p className="font-medium">{employee.phone}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
