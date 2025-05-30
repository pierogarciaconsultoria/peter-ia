
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Filter, Download, FileText, Users, Target } from "lucide-react";
import { TrainingMatrixService } from "@/services/trainingMatrixService";
import { JobPositionTrainingRequirement, TrainingMatrixData, ComplianceStats } from "@/types/trainingMatrix";
import { useToast } from "@/components/ui/use-toast";
import { TrainingMatrixTable } from "./TrainingMatrixTable";
import { TrainingRequirementDialog } from "./TrainingRequirementDialog";
import { ComplianceDashboard } from "./ComplianceDashboard";
import { TrainingMatrixFilters } from "./TrainingMatrixFilters";
import { TrainingReports } from "./TrainingReports";

export function TrainingMatrix() {
  const [matrixData, setMatrixData] = useState<TrainingMatrixData[]>([]);
  const [requirements, setRequirements] = useState<JobPositionTrainingRequirement[]>([]);
  const [complianceStats, setComplianceStats] = useState<ComplianceStats>({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    overdue: 0,
    completionRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRequirementDialogOpen, setIsRequirementDialogOpen] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState<JobPositionTrainingRequirement | null>(null);
  const [filters, setFilters] = useState({});
  const { toast } = useToast();

  // Mock company ID - em produção, vem do contexto
  const companyId = 'default-company-id';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [matrixResult, requirementsResult, statsResult] = await Promise.all([
        TrainingMatrixService.getTrainingMatrix(companyId),
        TrainingMatrixService.getJobPositionRequirements(companyId),
        TrainingMatrixService.getComplianceStats(companyId)
      ]);

      setMatrixData(matrixResult);
      setRequirements(requirementsResult);
      setComplianceStats(statsResult);
    } catch (error) {
      console.error("Error loading training matrix data:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados da matriz de treinamentos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRequirement = () => {
    setEditingRequirement(null);
    setIsRequirementDialogOpen(true);
  };

  const handleEditRequirement = (requirement: JobPositionTrainingRequirement) => {
    setEditingRequirement(requirement);
    setIsRequirementDialogOpen(true);
  };

  const handleDeleteRequirement = async (id: string) => {
    try {
      await TrainingMatrixService.deleteJobPositionRequirement(id);
      toast({
        title: "Sucesso",
        description: "Requisito de treinamento removido com sucesso.",
      });
      loadData();
    } catch (error) {
      console.error("Error deleting requirement:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o requisito de treinamento.",
        variant: "destructive",
      });
    }
  };

  const handleRequirementSaved = () => {
    setIsRequirementDialogOpen(false);
    loadData();
    toast({
      title: "Sucesso",
      description: "Requisito de treinamento salvo com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Matriz de Treinamentos</h2>
          <p className="text-muted-foreground">
            Gerencie requisitos de treinamento por cargo e monitore o compliance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {}}>
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" onClick={() => {}}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={handleCreateRequirement}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Requisito
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Requisitos</p>
                <p className="text-2xl font-bold">{complianceStats.total}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completados</p>
                <p className="text-2xl font-bold text-green-600">{complianceStats.completed}</p>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {complianceStats.completionRate.toFixed(1)}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Em Andamento</p>
                <p className="text-2xl font-bold text-blue-600">{complianceStats.inProgress}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Atrasados</p>
                <p className="text-2xl font-bold text-red-600">{complianceStats.overdue}</p>
              </div>
              <Badge variant="destructive">
                Atenção
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="matrix" className="space-y-4">
        <TabsList>
          <TabsTrigger value="matrix">Matriz por Cargo</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="management">Gerenciar Requisitos</TabsTrigger>
        </TabsList>

        <TabsContent value="matrix" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Matriz de Treinamentos por Cargo</CardTitle>
            </CardHeader>
            <CardContent>
              <TrainingMatrixTable 
                data={matrixData}
                isLoading={isLoading}
                onEditRequirement={handleEditRequirement}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <ComplianceDashboard 
            companyId={companyId}
            onRefresh={loadData}
          />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <TrainingReports 
            companyId={companyId}
            matrixData={matrixData}
          />
        </TabsContent>

        <TabsContent value="management" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Gerenciar Requisitos de Treinamento</CardTitle>
                <Button onClick={handleCreateRequirement}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Requisito
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requirements.map(requirement => (
                  <div key={requirement.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{requirement.job_position?.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {requirement.training?.title || requirement.procedure?.title}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={requirement.is_mandatory ? "default" : "secondary"}>
                            {requirement.is_mandatory ? "Obrigatório" : "Opcional"}
                          </Badge>
                          <Badge variant="outline">
                            {requirement.completion_deadline_days} dias para conclusão
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditRequirement(requirement)}
                        >
                          Editar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteRequirement(requirement.id)}
                        >
                          Remover
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {requirements.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhum requisito cadastrado</h3>
                    <p className="text-muted-foreground mb-4">
                      Comece criando requisitos de treinamento para os cargos da empresa.
                    </p>
                    <Button onClick={handleCreateRequirement}>
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeiro Requisito
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <TrainingRequirementDialog
        isOpen={isRequirementDialogOpen}
        onOpenChange={setIsRequirementDialogOpen}
        requirement={editingRequirement}
        onSaved={handleRequirementSaved}
        companyId={companyId}
      />
    </div>
  );
}
