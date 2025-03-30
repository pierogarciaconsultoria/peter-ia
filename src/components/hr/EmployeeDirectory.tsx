
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";

type JobPosition = {
  id: string;
  title: string;
  department: string;
  description: string;
};

type Employee = {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  position_id?: string; // Reference to job_positions table
  position_details?: JobPosition;
  status: "active" | "inactive" | "on_leave";
  hireDate: string;
  avatar?: string;
};

export function EmployeeDirectory() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch job positions and employees
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch job positions
        const { data: positionsData, error: positionsError } = await supabase
          .from('job_positions')
          .select('id, title, department, description');
        
        if (positionsError) {
          console.error('Error fetching job positions:', positionsError);
          return;
        }
        
        setJobPositions(positionsData || []);
        
        // For demo, we'll use mock data for employees but in a real app we'd fetch from the database
        const mockEmployeeData = [
          {
            id: "1",
            name: "João Silva",
            email: "joao.silva@exemplo.com",
            department: "Produção",
            position: "Gerente de Produção",
            position_id: "pos1", 
            status: "active" as const,
            hireDate: "2020-03-15",
            avatar: "",
          },
          {
            id: "2",
            name: "Maria Oliveira",
            email: "maria.oliveira@exemplo.com",
            department: "Recursos Humanos",
            position: "Coordenadora de RH",
            position_id: "pos2",
            status: "active" as const,
            hireDate: "2019-08-22",
            avatar: "",
          },
          {
            id: "3",
            name: "Pedro Santos",
            email: "pedro.santos@exemplo.com",
            department: "TI",
            position: "Desenvolvedor Sênior",
            position_id: "pos3",
            status: "active" as const,
            hireDate: "2021-01-10",
            avatar: "",
          },
          {
            id: "4",
            name: "Ana Ferreira",
            email: "ana.ferreira@exemplo.com",
            department: "Vendas",
            position: "Executiva de Contas",
            position_id: "pos4",
            status: "on_leave" as const,
            hireDate: "2018-11-05",
            avatar: "",
          },
          {
            id: "5",
            name: "Carlos Mendes",
            email: "carlos.mendes@exemplo.com",
            department: "Financeiro",
            position: "Analista Financeiro",
            position_id: "pos5",
            status: "inactive" as const,
            hireDate: "2017-05-18",
            avatar: "",
          },
        ];
        
        // Merge employee data with job position details
        const enrichedEmployees = mockEmployeeData.map(employee => {
          const positionDetails = positionsData?.find(p => p.id === employee.position_id);
          return {
            ...employee,
            position_details: positionDetails
          };
        });
        
        setEmployees(enrichedEmployees);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Ativo</Badge>;
      case "inactive":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Inativo</Badge>;
      case "on_leave":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Em licença</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR").format(date);
  };

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-muted-foreground">Carregando funcionários...</p>
        </div>
      ) : (
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
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={employee.avatar} />
                        <AvatarFallback>{employee.name.substring(0, 2)}</AvatarFallback>
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
                  <TableCell>{getStatusBadge(employee.status)}</TableCell>
                  <TableCell>{formatDate(employee.hireDate)}</TableCell>
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
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
