import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarDays, 
  Clock,
  Plus,
  User,
  AlertTriangle,
  FileText,
  Check,
  X
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import { calculateVacationPeriods, formatVacationDate } from "@/utils/vacationCalculations";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RequestFormDialog } from "../hr/personnel/RequestFormDialog";
import { movementTypes } from "./personnel/form/MovementTypeSelector";

export function VacationManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data, error } = await supabase
          .from('employees')
          .select('*')
          .eq('status', 'active');
          
        if (error) throw error;
        
        const employeesWithVacations = data.map(employee => {
          const hireDate = new Date(employee.hire_date);
          const vacationPeriods = calculateVacationPeriods(hireDate);
          return {
            ...employee,
            vacationPeriods
          };
        });
        
        setEmployees(employeesWithVacations);
      } catch (error) {
        console.error('Error fetching employees:', error);
        toast({
          title: "Erro ao carregar funcionários",
          description: "Não foi possível carregar os dados dos funcionários.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmployees();
  }, []);

  const handleNewRequest = () => {
    setIsDialogOpen(true);
  };

  const handleVacationRequest = async (data: any) => {
    try {
      data.type = "vacation";
      
      toast({
        title: "Solicitação enviada",
        description: "A solicitação de férias foi enviada com sucesso.",
      });

      const fetchEmployeesData = async () => {
        try {
          const { data, error } = await supabase
            .from('employees')
            .select('*')
            .eq('status', 'active');
            
          if (error) throw error;
          
          const employeesWithVacations = data.map(employee => {
            const hireDate = new Date(employee.hire_date);
            const vacationPeriods = calculateVacationPeriods(hireDate);
            return {
              ...employee,
              vacationPeriods
            };
          });
          
          setEmployees(employeesWithVacations);
        } catch (error) {
          console.error('Error fetching employees:', error);
        }
      };
      
      fetchEmployeesData();
    } catch (error) {
      console.error("Error submitting vacation request:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a solicitação de férias.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string, isExpiring: boolean = false) => {
    if (isExpiring) {
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        Vencendo
      </Badge>;
    }
    
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pendente</Badge>;
      case "expired":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Vencido</Badge>;
      case "scheduled":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Agendado</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Concluído</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-48">
      <p>Carregando dados de férias...</p>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Gestão de Férias</h2>
        <Button onClick={handleNewRequest}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Solicitação
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Férias Vencendo
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {employees.filter(emp => 
                emp.vacationPeriods.some(period => period.isExpiring)
              ).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Férias Vencidas
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {employees.filter(emp => 
                emp.vacationPeriods.some(period => period.status === 'expired')
              ).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Em Férias
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {employees.filter(emp => 
                emp.vacationPeriods.some(period => period.status === 'scheduled')
              ).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-2" />
                Total de Colaboradores
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Solicitações Recentes</CardTitle>
          <CardDescription>
            Gerenciamento de solicitações de férias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead>Data de Admissão</TableHead>
                <TableHead>Período Aquisitivo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dias Disponíveis</TableHead>
                <TableHead className="w-[160px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                employee.vacationPeriods.map((period, index) => (
                  <TableRow key={`${employee.id}-${index}`}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{formatVacationDate(new Date(employee.hire_date))}</TableCell>
                    <TableCell>
                      {formatVacationDate(period.startDate)} - {formatVacationDate(period.endDate)}
                    </TableCell>
                    <TableCell>{getStatusBadge(period.status, period.isExpiring)}</TableCell>
                    <TableCell>{period.daysAvailable}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <FileText className="h-4 w-4" />
                        </Button>
                        {period.status === "pending" && (
                          <>
                            <Button variant="outline" size="icon" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100">
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Exportar Relatório
          </Button>
        </CardFooter>
      </Card>

      <RequestFormDialog 
        isOpen={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        onSubmit={handleVacationRequest}
        jobPositions={[]}
      />
    </div>
  );
}
