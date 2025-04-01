import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  AlertTriangle, 
  Calendar, 
  Check, 
  Clock, 
  Edit, 
  FileCheck, 
  Plus, 
  Loader2,
  UserCheck,
  RefreshCcw
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrialEvaluationDialog } from "./TrialEvaluationDialog";
import { useTrialEvaluations } from "@/hooks/useTrialEvaluations";
import { EmployeeSelector } from "./departments/EmployeeSelector";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export function NewTrialEvaluation() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit' | 'evaluate' | 'hr-approve';
    data: any | null;
  }>({
    isOpen: false,
    mode: 'create',
    data: null
  });

  const {
    evaluations,
    isLoading,
    error,
    fetchEvaluations,
    createEvaluation,
    updateEvaluation,
    generateEvaluations
  } = useTrialEvaluations();

  // Calculate pending & completed evaluations
  const filteredEvaluations = activeTab === "all" 
    ? evaluations 
    : evaluations.filter(e => e.evaluation_type === activeTab);
  
  const pendingEvaluations = filteredEvaluations.filter(e => e.approved === null);
  const completedEvaluations = filteredEvaluations.filter(e => e.approved !== null);
  const approvedCount = completedEvaluations.filter(e => e.approved).length;
  const disapprovedCount = completedEvaluations.filter(e => e.approved === false).length;
  const pendingHRCount = completedEvaluations.filter(e => e.approved !== null && e.hr_approved === null).length;

  // Group employees by id to track multiple evaluations
  const employeeEvaluationsMap = evaluations.reduce((acc, evaluation) => {
    const id = evaluation.employee_id;
    if (!acc[id]) {
      acc[id] = [];
    }
    acc[id].push(evaluation);
    return acc;
  }, {} as Record<string, any[]>);

  // Calculate employees with all evaluations completed
  const employeesWithCompleteEvaluations = Object.values(employeeEvaluationsMap).filter(
    evaluations => {
      // Check if employee has at least one 30-day and one 90-day evaluation both completed
      const has30DayCompleted = evaluations.some(e => e.evaluation_type === '30_dias' && e.approved !== null);
      const has90DayCompleted = evaluations.some(e => e.evaluation_type === '90_dias' && e.approved !== null);
      return has30DayCompleted && has90DayCompleted;
    }
  ).length;

  const handleDialogOpen = (mode: 'create' | 'edit' | 'evaluate' | 'hr-approve', data: any = null) => {
    setDialogState({
      isOpen: true,
      mode,
      data
    });
  };

  const handleDialogClose = () => {
    setDialogState({
      ...dialogState,
      isOpen: false
    });
  };

  const handleDialogSubmit = async (formData: any) => {
    if (dialogState.mode === 'create') {
      return await createEvaluation(formData);
    } else {
      return await updateEvaluation(dialogState.data.id, formData);
    }
  };

  const handleManualEvaluationCreate = () => {
    handleDialogOpen('create');
  };

  const handleManualEmployeeSelect = async (employee_id: string) => {
    if (!employee_id) return;

    try {
      // Get employee hire date (in a real app, you would fetch this from API)
      // For this example, we're using today's date
      const hireDate = new Date().toISOString().split('T')[0];
      await generateEvaluations(employee_id, hireDate);
      toast.success("Avaliações geradas com sucesso");
    } catch (error) {
      console.error("Error generating evaluations:", error);
      toast.error("Falha ao gerar avaliações");
    }
  };

  const handleRetry = () => {
    fetchEvaluations();
    toast.info("Recarregando avaliações...");
  };

  // Render status badge based on evaluation status
  const getStatusBadge = (evaluation: any) => {
    if (evaluation.approved === null) {
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pendente</Badge>;
    } else if (evaluation.approved === true) {
      if (evaluation.hr_approved === null) {
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Aguardando RH</Badge>;
      }
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Aprovado</Badge>;
    } else if (evaluation.approved === false) {
      if (evaluation.hr_approved === null) {
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Aguardando RH</Badge>;
      }
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Não Aprovado</Badge>;
    }
    return <Badge variant="outline">Desconhecido</Badge>;
  };

  const getEvaluationTypeName = (type: string) => {
    switch(type) {
      case "30_dias": return "30 Dias";
      case "45_dias": return "45 Dias";
      case "90_dias": return "90 Dias";
      default: return type;
    }
  };

  // Show loading skeleton during data fetch
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between mb-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        
        <div className="grid gap-6 md:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Skeleton className="h-10 w-full" />
        
        <div className="space-y-4">
          <Skeleton className="h-6 w-80" />
          <div className="rounded-md border">
            <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state with retry button
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Avaliação de Período de Experiência</h2>
        </div>
        
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro ao carregar avaliações</AlertTitle>
          <AlertDescription>
            Falha ao carregar avaliações de período de experiência. 
            Por favor tente novamente mais tarde.
          </AlertDescription>
        </Alert>

        <div className="flex justify-center">
          <Button onClick={handleRetry} className="flex items-center gap-2">
            <RefreshCcw className="h-4 w-4" />
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Avaliação de Período de Experiência</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRetry} className="flex items-center gap-2">
            <RefreshCcw className="h-4 w-4" />
            Atualizar
          </Button>
          <div className="relative">
            <div className="flex w-full max-w-xs items-center space-x-2">
              <EmployeeSelector 
                value="" 
                onChange={handleManualEmployeeSelect}
                placeholder="Gerar avaliações automáticas" 
              />
            </div>
          </div>
          <Button onClick={handleManualEvaluationCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Avaliação
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="30_dias">30 Dias</TabsTrigger>
          <TabsTrigger value="45_dias">45 Dias</TabsTrigger>
          <TabsTrigger value="90_dias">90 Dias</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="grid gap-6 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Avaliações Pendentes
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingEvaluations.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <FileCheck className="h-4 w-4 mr-2" />
                Avaliações Aguardando RH
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingHRCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Check className="h-4 w-4 mr-2" />
                Aprovados
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Não Aprovados
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{disapprovedCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Ciclo Completo
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employeesWithCompleteEvaluations}</div>
            <p className="text-xs text-muted-foreground mt-1">30 e 90 dias concluídos</p>
          </CardContent>
        </Card>
      </div>

      {pendingEvaluations.length > 0 && (
        <Alert>
          <Calendar className="h-4 w-4" />
          <AlertTitle>Avaliações Pendentes</AlertTitle>
          <AlertDescription>
            Existem {pendingEvaluations.length} avaliação(ões) de período de experiência pendentes.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Avaliações {activeTab === "all" ? "Recentes" : getEvaluationTypeName(activeTab)}</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead>Data de Contratação</TableHead>
                <TableHead>Tipo de Avaliação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Avaliador</TableHead>
                <TableHead>Média</TableHead>
                <TableHead className="w-[80px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvaluations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <FileCheck className="h-8 w-8 mb-2" />
                      Nenhuma avaliação encontrada
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEvaluations.map((evaluation) => {
                  const averageScore = evaluation.performance_score !== null 
                    ? Math.round((evaluation.performance_score + evaluation.adaptation_score + evaluation.behavior_score) / 3).toFixed(0) 
                    : "-";
                    
                  return (
                    <TableRow key={evaluation.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={evaluation.employee?.avatar_url || ""} />
                            <AvatarFallback>{evaluation.employee?.name?.substring(0, 2) || "--"}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">{evaluation.employee?.name || "N/A"}</span>
                            <span className="text-xs text-muted-foreground">{evaluation.employee?.position || "N/A"}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{evaluation.employee?.hire_date ? new Date(evaluation.employee.hire_date).toLocaleDateString('pt-BR') : "N/A"}</TableCell>
                      <TableCell>{getEvaluationTypeName(evaluation.evaluation_type)}</TableCell>
                      <TableCell>{getStatusBadge(evaluation)}</TableCell>
                      <TableCell>{evaluation.evaluator?.name || "-"}</TableCell>
                      <TableCell>
                        {averageScore}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {evaluation.approved === null ? (
                            <Button 
                              size="sm"
                              onClick={() => handleDialogOpen('evaluate', evaluation)}
                            >
                              <UserCheck className="h-4 w-4 mr-1" /> Avaliar
                            </Button>
                          ) : evaluation.approved !== null && evaluation.hr_approved === null ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDialogOpen('hr-approve', evaluation)}
                            >
                              <FileCheck className="h-4 w-4 mr-1" /> Aprovar RH
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleDialogOpen('edit', evaluation)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <TrialEvaluationDialog
        isOpen={dialogState.isOpen}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
        initialData={dialogState.data}
        mode={dialogState.mode}
      />
    </div>
  );
}
