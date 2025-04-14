
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  PlusCircle, FilePlus, ListFilter, BarChart, 
  Users, FileCheck, FileText, Table2, Calendar
} from "lucide-react";
import { TrainingFilterBar } from "../training/TrainingFilterBar";
import { useToast } from "@/hooks/use-toast";
import { TrainingTable } from "./TrainingTable";
import { TrainingStats } from "./TrainingStats";
import { NewTrainingDialog } from "./NewTrainingDialog";
import { useNavigate } from "react-router-dom";
import { Training } from "@/services/trainingService";
import { JobPosition } from "../types";

export function TrainingDashboard() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [filteredTrainings, setFilteredTrainings] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'list'>('dashboard');
  const [departments, setDepartments] = useState<string[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [procedures, setProcedures] = useState<string[]>([]);
  const [isNewTrainingDialogOpen, setIsNewTrainingDialogOpen] = useState(false);
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load data
  useEffect(() => {
    fetchTrainings();
    fetchDepartments();
    fetchEmployees();
    fetchProcedures();
    fetchJobPositions();
  }, []);

  const fetchTrainings = async () => {
    setIsLoading(true);
    try {
      // In a real scenario, this would be fetched from Supabase
      const mockTrainings: Training[] = [
        {
          id: "1",
          title: "Integração de novos funcionários",
          description: "Treinamento inicial para novos colaboradores",
          training_date: "2023-11-15",
          duration: 4,
          trainer: "João Silva",
          department: "Recursos Humanos",
          status: "completed",
          participants: [
            { id: "1", name: "Ana Costa", status: "completed" },
            { id: "2", name: "Carlos Eduardo", status: "completed" }
          ]
        },
        {
          id: "2",
          title: "Segurança da Informação",
          description: "Treinamento sobre políticas de segurança",
          training_date: "2023-12-10",
          duration: 2,
          trainer: "Márcia Oliveira",
          department: "TI",
          status: "planned",
          participants: [
            { id: "3", name: "Pedro Santos", status: "confirmed" },
            { id: "4", name: "Lúcia Mendes", status: "confirmed" }
          ]
        },
        {
          id: "3",
          title: "Procedimento ISO 9001",
          description: "Treinamento sobre requisitos da ISO 9001",
          training_date: "2023-12-05",
          duration: 6,
          trainer: "Roberto Almeida",
          department: "Qualidade",
          status: "in_progress",
          participants: [
            { id: "5", name: "Fernanda Lima", status: "in_progress" },
            { id: "6", name: "José Carlos", status: "in_progress" }
          ],
          evaluation_method: "Prova teórica"
        }
      ];
      
      setTrainings(mockTrainings);
      setFilteredTrainings(mockTrainings);
    } catch (error) {
      console.error("Erro ao buscar treinamentos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os treinamentos",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      // Mock departments
      setDepartments([
        "Recursos Humanos",
        "TI",
        "Qualidade",
        "Produção",
        "Administrativo",
        "Financeiro"
      ]);
    } catch (error) {
      console.error("Erro ao buscar departamentos:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      // Mock employees
      setEmployees([
        { id: "1", name: "Ana Costa", department: "Recursos Humanos" },
        { id: "2", name: "Carlos Eduardo", department: "Recursos Humanos" },
        { id: "3", name: "Pedro Santos", department: "TI" },
        { id: "4", name: "Lúcia Mendes", department: "TI" },
        { id: "5", name: "Fernanda Lima", department: "Qualidade" },
        { id: "6", name: "José Carlos", department: "Qualidade" }
      ]);
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error);
    }
  };

  const fetchProcedures = async () => {
    try {
      // Mock procedures
      setProcedures([
        "ISO 9001",
        "ISO 14001",
        "Segurança do Trabalho",
        "Controle de Qualidade",
        "Onboarding"
      ]);
    } catch (error) {
      console.error("Erro ao buscar procedimentos:", error);
    }
  };

  const fetchJobPositions = async () => {
    try {
      // Mock job positions
      setJobPositions([
        {
          id: "1",
          title: "Analista de Qualidade",
          description: "Responsável pela qualidade dos produtos",
          department: "Qualidade",
          required_procedures: ["ISO 9001", "Controle de Qualidade"]
        },
        {
          id: "2",
          title: "Desenvolvedor",
          description: "Responsável pelo desenvolvimento de software",
          department: "TI",
          required_procedures: ["Segurança da Informação"]
        }
      ]);
    } catch (error) {
      console.error("Erro ao buscar cargos:", error);
    }
  };

  // Apply filters
  const handleFilterChange = (filters: any) => {
    let filtered = [...trainings];

    if (filters.startDate) {
      filtered = filtered.filter(t => 
        new Date(t.training_date) >= filters.startDate
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(t => 
        new Date(t.training_date) <= filters.endDate
      );
    }

    if (filters.department) {
      filtered = filtered.filter(t => t.department === filters.department);
    }

    if (filters.employeeId) {
      filtered = filtered.filter(t => 
        t.participants.some(p => p.id === filters.employeeId)
      );
    }

    if (filters.procedure) {
      filtered = filtered.filter(t => 
        t.title.includes(filters.procedure) || 
        (t.description && t.description.includes(filters.procedure))
      );
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(query) || 
        t.trainer.toLowerCase().includes(query) ||
        (t.description && t.description.toLowerCase().includes(query))
      );
    }

    setFilteredTrainings(filtered);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Controle de Treinamentos</h2>
          <p className="text-muted-foreground">
            Gerencie os treinamentos da sua equipe e acompanhe o desenvolvimento de competências
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button onClick={() => fetchTrainings()} variant="outline" disabled={isLoading}>
            <ListFilter className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button onClick={() => setIsNewTrainingDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Novo Treinamento
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <TrainingFilterBar 
        departments={departments}
        employees={employees}
        procedures={procedures}
        onFilterChange={handleFilterChange}
      />
      
      {/* Toggle between dashboard and list */}
      <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'dashboard' | 'list')}>
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard">
            <BarChart className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="list">
            <Table2 className="h-4 w-4 mr-2" />
            Lista de Treinamentos
          </TabsTrigger>
        </TabsList>
        
        {/* Dashboard */}
        <TabsContent value="dashboard">
          <TrainingStats trainings={filteredTrainings} />
        </TabsContent>
        
        {/* List of Trainings */}
        <TabsContent value="list">
          <TrainingTable 
            trainings={filteredTrainings} 
            isLoading={isLoading} 
          />
        </TabsContent>
      </Tabs>

      {/* New Training Dialog */}
      <NewTrainingDialog 
        open={isNewTrainingDialogOpen}
        onOpenChange={setIsNewTrainingDialogOpen}
        departments={departments}
        employees={employees}
        procedures={procedures}
        onTrainingCreated={(newTraining) => {
          setTrainings((prev) => [...prev, newTraining]);
          setFilteredTrainings((prev) => [...prev, newTraining]);
          toast({
            title: "Treinamento criado",
            description: "O treinamento foi adicionado com sucesso.",
          });
        }}
      />
    </div>
  );
}
