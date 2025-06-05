
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Target } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchTrainings as getTrainings, Training } from "@/services/trainingService";
import { TrainingFilters } from "@/services/trainingService";
import { supabase } from "@/integrations/supabase/client";
import { TrainingStats } from "./TrainingStats";
import { TrainingTable } from "./TrainingTable";
import { TrainingFilterBar } from "./TrainingFilterBar";
import { NewTrainingDialog } from "./NewTrainingDialog";
import { TrainingMatrix } from "./TrainingMatrix";
import { ComplianceDashboard } from "./ComplianceDashboard";
import { TrainingReports } from "./TrainingReports";
import { TrainingRequirementDialog } from "./TrainingRequirementDialog";
import { TrainingMatrixService } from "@/services/trainingMatrixService";
import { TrainingMatrixData, JobPositionTrainingRequirement } from "@/types/trainingMatrix";
import { useToast } from "@/components/ui/use-toast";
import { debounce } from "@/utils/performanceUtils";
import { useQuery, QueryFunctionContext } from "@tanstack/react-query";

// Função otimizada para fetch de treinamentos com React Query
const fetchTrainingsOptimized = async ({ queryKey }: QueryFunctionContext): Promise<Training[]> => {
  const [, filters] = queryKey as [string, TrainingFilters | undefined];
  return getTrainings(filters);
};

export function TrainingDashboard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRequirementDialogOpen, setIsRequirementDialogOpen] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState<JobPositionTrainingRequirement | null>(null);
  const [filteredTrainings, setFilteredTrainings] = useState<Training[]>([]);
  const [requirements, setRequirements] = useState<JobPositionTrainingRequirement[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [procedures, setProcedures] = useState<any[]>([]);
  const [matrixData, setMatrixData] = useState<TrainingMatrixData[]>([]);
  const [companyId, setCompanyId] = useState<string>("");
  const [currentFilters, setCurrentFilters] = useState<TrainingFilters | undefined>(undefined);
  const { toast } = useToast();

  // Usar React Query para otimizar carregamento de treinamentos
  const { data: trainings = [], isLoading, refetch } = useQuery({
    queryKey: ['trainings', currentFilters],
    queryFn: fetchTrainingsOptimized,
    staleTime: 5 * 60 * 1000, // 5 minutos de cache
  });

  useEffect(() => {
    setFilteredTrainings(trainings);
  }, [trainings]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Get user's company ID
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('company_id')
        .eq('id', userData.user.id)
        .single();

      if (!profileData?.company_id) return;
      
      setCompanyId(profileData.company_id);

      // Fetch departments usando índice otimizado
      const { data: deptData } = await supabase
        .from('departments')
        .select('name')
        .eq('company_id', profileData.company_id)
        .order('name');
      
      if (deptData) {
        const deptNames = deptData.map(dept => dept.name);
        setDepartments(deptNames);
      }

      // Fetch employees usando índice otimizado
      const { data: employeeData } = await supabase
        .from('employees')
        .select('id, name, department')
        .eq('status', 'active')
        .eq('company_id', profileData.company_id);
      
      if (employeeData) {
        setEmployees(employeeData);
      }

      // Mock procedures data since iso_documents table doesn't exist
      const mockProcedures = [
        {
          id: '1',
          title: 'Procedimento de Segurança',
          document_type: 'procedure',
          associated_requirement: '4.1'
        },
        {
          id: '2',
          title: 'Manual de Qualidade',
          document_type: 'manual',
          associated_requirement: '4.2'
        }
      ];
      setProcedures(mockProcedures);

      // Fetch matrix data and requirements
      const [matrixResult, requirementsResult] = await Promise.all([
        TrainingMatrixService.getTrainingMatrix(profileData.company_id),
        TrainingMatrixService.getJobPositionRequirements(profileData.company_id)
      ]);
      
      setMatrixData(matrixResult);
      setRequirements(requirementsResult);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados de treinamentos.",
        variant: "destructive",
      });
    }
  };

  const handleTrainingCreated = async (newTraining: any) => {
    toast({
      title: "Sucesso",
      description: "Treinamento criado com sucesso",
    });
    await refetch();
  };

  const handleRequirementSaved = async () => {
    setIsRequirementDialogOpen(false);
    setEditingRequirement(null);
    toast({
      title: "Sucesso",
      description: "Requisito de treinamento salvo com sucesso.",
    });
    await fetchData();
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
      await fetchData();
    } catch (error) {
      console.error("Error deleting requirement:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o requisito de treinamento.",
        variant: "destructive",
      });
    }
  };

  // Debounce otimizado para filtros
  const debouncedFilterChange = debounce((filters: any) => {
    let filtered = [...trainings];

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(training => 
        training.title.toLowerCase().includes(query) || 
        (training.description && training.description.toLowerCase().includes(query))
      );
    }

    if (filters.department && filters.department !== 'all') {
      filtered = filtered.filter(training => training.department === filters.department);
    }

    if (filters.employeeId && filters.employeeId !== 'all') {
      filtered = filtered.filter(training => {
        if (!training.participants) return false;
        return training.participants.some((p: any) => p.id === filters.employeeId);
      });
    }

    if (filters.procedure && filters.procedure !== 'all') {
      filtered = filtered.filter(training => 
        training.procedure_id === filters.procedure || 
        training.title.includes(filters.procedure)
      );
    }

    if (filters.startDate) {
      filtered = filtered.filter(training => 
        new Date(training.training_date) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(training => 
        new Date(training.training_date) <= new Date(filters.endDate)
      );
    }

    setFilteredTrainings(filtered);
    
    // Atualizar filtros para React Query quando necessário
    if (filters.searchQuery || filters.department !== 'all' || filters.startDate || filters.endDate) {
      setCurrentFilters(filters);
    }
  }, 300);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Controle de Treinamentos</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Treinamento
        </Button>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="matrix">Matriz por Cargo</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="trainings">Lista de Treinamentos</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas de Treinamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <TrainingStats trainings={trainings} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumo Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <TrainingFilterBar 
                departments={departments}
                employees={employees}
                procedures={procedures}
                onFilterChange={debouncedFilterChange}
              />
              <div className="mt-4">
                <TrainingTable 
                  trainings={filteredTrainings.slice(0, 5)} 
                  isLoading={isLoading} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matrix">
          <TrainingMatrix />
        </TabsContent>

        <TabsContent value="compliance">
          <ComplianceDashboard 
            companyId={companyId}
            onRefresh={fetchData}
          />
        </TabsContent>

        <TabsContent value="trainings" className="space-y-6">
          <TrainingFilterBar 
            departments={departments}
            employees={employees}
            procedures={procedures}
            onFilterChange={debouncedFilterChange}
          />

          <Card>
            <CardHeader>
              <CardTitle>Lista Completa de Treinamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <TrainingTable 
                trainings={filteredTrainings} 
                isLoading={isLoading} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <TrainingReports 
            companyId={companyId}
            matrixData={matrixData}
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
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
                    <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
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

          <Card>
            <CardHeader>
              <CardTitle>Outras Configurações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline">
                  Configurar Notificações
                </Button>
                <Button variant="outline">
                  Importar/Exportar Dados
                </Button>
                <Button variant="outline">
                  Configurações Gerais
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <NewTrainingDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        departments={departments}
        employees={employees}
        procedures={procedures}
        onTrainingCreated={handleTrainingCreated}
      />

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
