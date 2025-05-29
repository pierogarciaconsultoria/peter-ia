
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
import { VacationRequestForm } from "./vacation/VacationRequestForm";
import { useVacations } from "@/hooks/useVacations";

export function VacationManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const { toast } = useToast();
  
  const {
    vacationRequests,
    loading,
    addVacationRequest,
    updateVacationRequest,
    formatDate
  } = useVacations();
  
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
        setEmployeesLoading(false);
      }
    };
    
    fetchEmployees();
  }, [toast]);

  const handleVacationRequest = async (data: any) => {
    try {
      await addVacationRequest(data);
    } catch (error) {
      console.error("Error submitting vacation request:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a solicitação de férias.",
        variant: "destructive"
      });
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      await updateVacationRequest(requestId, { 
        status: 'approved',
        approved_at: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error approving vacation request:", error);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await updateVacationRequest(requestId, { 
        status: 'rejected',
        rejection_reason: 'Rejeitado pelo gestor'
      });
    } catch (error) {
      console.error("Error rejecting vacation request:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pendente</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Aprovado</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejeitado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Calcular estatísticas
  const totalEmployees = employees.length;
  const expiringVacations = employees.filter(emp => 
    emp.vacationPeriods?.some((period: any) => period.isExpiring)
  ).length;
  const expiredVacations = employees.filter(emp => 
    emp.vacationPeriods?.some((period: any) => period.status === 'expired')
  ).length;
  const onVacation = vacationRequests.filter(req => 
    req.status === 'approved' && 
    new Date(req.start_date) <= new Date() && 
    new Date(req.end_date) >= new Date()
  ).length;

  if (loading || employeesLoading) {
    return <div className="flex items-center justify-center h-48">
      <p>Carregando dados de férias...</p>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Gestão de Férias</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
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
            <div className="text-2xl font-bold">{expiringVacations}</div>
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
            <div className="text-2xl font-bold">{expiredVacations}</div>
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
            <div className="text-2xl font-bold">{onVacation}</div>
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
            <div className="text-2xl font-bold">{totalEmployees}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Solicitações de Férias</CardTitle>
          <CardDescription>
            Gerenciamento de solicitações de férias dos funcionários
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Dias</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[160px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vacationRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    <div>
                      <p className="font-medium">{request.employee?.name}</p>
                      <p className="text-sm text-muted-foreground">{request.employee?.department}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDate(request.start_date)} - {formatDate(request.end_date)}
                  </TableCell>
                  <TableCell>{request.days_requested} dias</TableCell>
                  <TableCell>
                    {request.vacation_type === 'regular' ? 'Regulares' : 'Proporcionais'}
                  </TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <FileText className="h-4 w-4" />
                      </Button>
                      {request.status === "pending" && (
                        <>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                            onClick={() => handleApprove(request.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                            onClick={() => handleReject(request.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
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

      <VacationRequestForm 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onSubmit={handleVacationRequest}
        employees={employees}
      />
    </div>
  );
}
