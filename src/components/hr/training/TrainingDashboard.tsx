
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchTrainings as getTrainings } from "@/services/training";
import { Training } from "@/types/training";
import { supabase } from "@/integrations/supabase/client";
import { TrainingStats } from "./TrainingStats";
import { TrainingTable } from "./TrainingTable";
import { TrainingFilterBar } from "./TrainingFilterBar";
import { NewTrainingDialog } from "./NewTrainingDialog";
import { TrainingMatrix } from "./TrainingMatrix";
import { ComplianceDashboard } from "./ComplianceDashboard";
import { TrainingReports } from "./TrainingReports";
import { TrainingMatrixService } from "@/services/trainingMatrixService";
import { TrainingMatrixData } from "@/types/trainingMatrix";
import { useToast } from "@/components/ui/use-toast";

export function TrainingDashboard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [filteredTrainings, setFilteredTrainings] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [departments, setDepartments] = useState<string[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [procedures, setProcedures] = useState<any[]>([]);
  const [matrixData, setMatrixData] = useState<TrainingMatrixData[]>([]);
  const [companyId, setCompanyId] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
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

      // Fetch trainings
      const trainingData = await getTrainings();
      setTrainings(trainingData);
      setFilteredTrainings(trainingData);

      // Fetch departments
      const { data: deptData } = await supabase
        .from('departments')
        .select('name')
        .eq('company_id', profileData.company_id)
        .order('name');
      
      if (deptData) {
        const deptNames = deptData.map(dept => dept.name);
        setDepartments(deptNames);
      }

      // Fetch employees
      const { data: employeeData } = await supabase
        .from('employees')
        .select('id, name, department')
        .eq('status', 'active')
        .eq('company_id', profileData.company_id);
      
      if (employeeData) {
        setEmployees(employeeData);
      }

      // Fetch procedures
      const { data: procedureData } = await supabase
        .from('iso_documents')
        .select('id, title, document_type, associated_requirement')
        .eq('document_type', 'procedure');
      
      if (procedureData) {
        setProcedures(procedureData);
      }

      // Fetch matrix data
      const matrixResult = await TrainingMatrixService.getTrainingMatrix(profileData.company_id);
      setMatrixData(matrixResult);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados de treinamentos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrainingCreated = async (newTraining: any) => {
    toast({
      title: "Sucesso",
      description: "Treinamento criado com sucesso",
    });
    await fetchData();
  };

  const handleFilterChange = (filters: any) => {
    let filtered = [...trainings];

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(training => 
        training.title.toLowerCase().includes(query) || 
        (training.description && training.description.toLowerCase().includes(query))
      );
    }

    // Filter by department
    if (filters.department && filters.department !== 'all') {
      filtered = filtered.filter(training => training.department === filters.department);
    }

    // Filter by employee
    if (filters.employeeId && filters.employeeId !== 'all') {
      filtered = filtered.filter(training => {
        if (!training.participants) return false;
        return training.participants.some((p: any) => p.id === filters.employeeId);
      });
    }

    // Filter by procedure
    if (filters.procedure && filters.procedure !== 'all') {
      filtered = filtered.filter(training => 
        training.procedure_id === filters.procedure || 
        training.title.includes(filters.procedure)
      );
    }

    // Filter by date range
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
  };

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
                onFilterChange={handleFilterChange}
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
            onFilterChange={handleFilterChange}
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
              <CardTitle>Configurações da Matriz de Treinamento</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Configure os requisitos de treinamento por cargo e gerencie as configurações do sistema.
              </p>
              <div className="space-y-4">
                <Button variant="outline">
                  Gerenciar Requisitos por Cargo
                </Button>
                <Button variant="outline">
                  Configurar Notificações
                </Button>
                <Button variant="outline">
                  Importar/Exportar Dados
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
    </div>
  );
}
