
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  getTrialEvaluations, 
  getTrialEvaluationConfig, 
  updateTrialEvaluation,
  generateTrialEvaluationsBR,
  getEmployeeTrialEvaluations,
  TrialEvaluationWithEmployee,
  TrialEvaluationConfig
} from "@/services/trialEvaluationService";
import { Employee } from "@/services/employee/types";
import { supabase } from "@/integrations/supabase/client";
import { EmployeeSelector } from "./departments/EmployeeSelector";
import { TrialEvaluationBrazilianForm } from "./trial-evaluation/TrialEvaluationBrazilianForm";
import { TrialEvaluationComparison } from "./trial-evaluation/TrialEvaluationComparison";
import { TrialEvaluationConfigComponent } from "./trial-evaluation/TrialEvaluationConfig";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Edit, Settings, Users, FileCheck, Plus } from "lucide-react";

const formSchema = z.object({
  employee_id: z.string().min(1, {
    message: "Employee is required."
  }),
  evaluation_date: z.string().min(1, {
    message: "Evaluation date is required."
  }),
  evaluation_type: z.enum(['30_dias', '45_dias', '90_dias']).default('30_dias')
});

interface NewTrialEvaluationFormValues {
  employee_id: string;
  evaluation_date: string;
  evaluation_type: '30_dias' | '45_dias' | '90_dias';
}

export function NewTrialEvaluation() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [evaluations, setEvaluations] = useState<TrialEvaluationWithEmployee[]>([]);
  const [config, setConfig] = useState<TrialEvaluationConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvaluation, setSelectedEvaluation] = useState<TrialEvaluationWithEmployee | null>(null);
  const [selectedEmployeeForComparison, setSelectedEmployeeForComparison] = useState<string | null>(null);
  const [comparisonEvaluations, setComparisonEvaluations] = useState<TrialEvaluationWithEmployee[]>([]);
  const [activeTab, setActiveTab] = useState("list");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Buscar funcionários
      const { data: employeesData, error: employeesError } = await supabase
        .from('employees')
        .select('*')
        .eq('status', 'active');
      
      if (employeesError) throw employeesError;
      
      const typedEmployees = (employeesData || []).map(emp => ({
        ...emp,
        status: emp.status as "active" | "inactive" | "on_leave"
      }));
      setEmployees(typedEmployees);

      // Buscar avaliações
      const evaluationsData = await getTrialEvaluations();
      setEvaluations(evaluationsData);

      // Buscar configuração da empresa (usando a primeira empresa encontrada)
      if (typedEmployees.length > 0) {
        const companyId = typedEmployees[0].company_id;
        const configData = await getTrialEvaluationConfig(companyId);
        setConfig(configData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const form = useForm<NewTrialEvaluationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employee_id: "",
      evaluation_date: new Date().toISOString().split('T')[0],
      evaluation_type: '30_dias'
    }
  });

  async function onSubmit(data: NewTrialEvaluationFormValues) {
    try {
      const employee = employees.find(emp => emp.id === data.employee_id);
      if (!employee) {
        toast({
          title: "Erro",
          description: "Funcionário não encontrado.",
          variant: "destructive"
        });
        return;
      }

      // Gerar avaliações automaticamente baseado na configuração
      const success = await generateTrialEvaluationsBR(data.employee_id, employee.hire_date);
      
      if (success) {
        toast({
          title: "Sucesso",
          description: "Avaliações de experiência geradas automaticamente."
        });
        fetchData();
        setActiveTab("list");
      } else {
        toast({
          title: "Erro",
          description: "Falha ao gerar avaliações.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    }
  }

  const handleEvaluate = (evaluation: TrialEvaluationWithEmployee) => {
    setSelectedEvaluation(evaluation);
    setActiveTab("evaluate");
  };

  const handleSaveEvaluation = async (data: any) => {
    if (!selectedEvaluation) return false;

    const success = await updateTrialEvaluation(selectedEvaluation.id, data);
    if (success) {
      fetchData();
      setSelectedEvaluation(null);
      setActiveTab("list");
    }
    return success;
  };

  const handleViewComparison = async (employeeId: string) => {
    try {
      const employeeEvaluations = await getEmployeeTrialEvaluations(employeeId);
      setComparisonEvaluations(employeeEvaluations);
      setSelectedEmployeeForComparison(employeeId);
      setActiveTab("comparison");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar avaliações para comparação.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (evaluation: TrialEvaluationWithEmployee) => {
    if (evaluation.final_decision === 'approved') {
      return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
    } else if (evaluation.final_decision === 'rejected') {
      return <Badge className="bg-red-100 text-red-800">Não Aprovado</Badge>;
    } else if (evaluation.final_decision === 'extended') {
      return <Badge className="bg-yellow-100 text-yellow-800">Prorrogado</Badge>;
    } else if (evaluation.performance_score !== null) {
      return <Badge className="bg-blue-100 text-blue-800">Avaliado</Badge>;
    } else {
      return <Badge variant="outline">Pendente</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Avaliações de Período de Experiência</h1>
        <p className="text-muted-foreground">Gerencie e acompanhe as avaliações de período de experiência dos funcionários</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            Avaliações
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Gerar Nova
          </TabsTrigger>
          <TabsTrigger value="evaluate" disabled={!selectedEvaluation} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Avaliar
          </TabsTrigger>
          <TabsTrigger value="comparison" disabled={!selectedEmployeeForComparison} className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Comparar
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configurações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Avaliações</CardTitle>
              <CardDescription>Todas as avaliações de período de experiência</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Funcionário</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Data da Avaliação</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Média</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evaluations.map((evaluation) => {
                    const criteriaScores = evaluation.evaluation_criteria_scores || {};
                    const scoresArray = Object.values(criteriaScores).filter(score => typeof score === 'number') as number[];
                    const average = scoresArray.length > 0 ? scoresArray.reduce((sum, score) => sum + score, 0) / scoresArray.length : 0;

                    return (
                      <TableRow key={evaluation.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={evaluation.employee.avatar_url || ""} />
                              <AvatarFallback>{evaluation.employee.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{evaluation.employee.name}</div>
                              <div className="text-sm text-muted-foreground">{evaluation.employee.position}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {evaluation.evaluation_period_number}º de {evaluation.total_evaluation_periods}
                        </TableCell>
                        <TableCell>
                          {new Date(evaluation.evaluation_date).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(evaluation)}
                        </TableCell>
                        <TableCell>
                          {average > 0 ? average.toFixed(1) : "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEvaluate(evaluation)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewComparison(evaluation.employee_id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerar Avaliações de Experiência</CardTitle>
              <CardDescription>Selecione um funcionário para gerar automaticamente suas avaliações de período de experiência</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField 
                    control={form.control} 
                    name="employee_id" 
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Funcionário</FormLabel>
                        <FormControl>
                          <EmployeeSelector 
                            employeeId={field.value} 
                            setEmployeeId={field.onChange} 
                            employees={employees} 
                            error={form.formState.errors.employee_id?.message} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} 
                  />

                  <Button type="submit">Gerar Avaliações</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evaluate" className="space-y-4">
          {selectedEvaluation && config && (
            <TrialEvaluationBrazilianForm
              evaluation={selectedEvaluation}
              config={config}
              onSave={handleSaveEvaluation}
              onCancel={() => {
                setSelectedEvaluation(null);
                setActiveTab("list");
              }}
              mode="evaluate"
            />
          )}
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          {comparisonEvaluations.length > 0 && config && (
            <TrialEvaluationComparison
              evaluations={comparisonEvaluations}
              criteria={config.evaluation_criteria}
            />
          )}
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          {employees.length > 0 && (
            <TrialEvaluationConfigComponent
              companyId={employees[0].company_id}
              onSave={() => {
                fetchData();
                toast({
                  title: "Configuração atualizada",
                  description: "As configurações foram atualizadas com sucesso."
                });
              }}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default NewTrialEvaluation;
