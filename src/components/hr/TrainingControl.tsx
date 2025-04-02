
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PlusCircle, FilePlus, ListFilter, BarChart, Users, FileCheck, FileText, Table2 } from "lucide-react";
import { TrainingFilterBar, TrainingFilters } from "./training/TrainingFilterBar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Tipos
interface Training {
  id: string;
  title: string;
  description?: string;
  training_date: string;
  duration: number;
  trainer: string;
  department: string;
  status: 'planned' | 'in_progress' | 'completed' | 'canceled';
  participants: any[];
  evaluation_method?: string;
}

interface TrainingStats {
  total: number;
  planned: number;
  inProgress: number;
  completed: number;
  departments: Record<string, number>;
  monthlyDistribution: Record<string, number>;
}

export function TrainingControl() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [filteredTrainings, setFilteredTrainings] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'list'>('dashboard');
  const [departments, setDepartments] = useState<string[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [procedures, setProcedures] = useState<string[]>([]);
  const [stats, setStats] = useState<TrainingStats>({
    total: 0,
    planned: 0,
    inProgress: 0,
    completed: 0,
    departments: {},
    monthlyDistribution: {}
  });

  const { toast } = useToast();

  // Carregar dados
  useEffect(() => {
    fetchTrainings();
    fetchDepartments();
    fetchEmployees();
    fetchProcedures();
  }, []);

  // Atualizar estatísticas quando os treinamentos mudarem
  useEffect(() => {
    calculateStats(trainings);
  }, [trainings]);

  const fetchTrainings = async () => {
    setIsLoading(true);
    try {
      // Em um cenário real, isso seria buscado do Supabase
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
      // Departamentos simulados
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
      // Funcionários simulados
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
      // Procedimentos simulados
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

  // Calcular estatísticas dos treinamentos
  const calculateStats = (trainingList: Training[]) => {
    const newStats: TrainingStats = {
      total: trainingList.length,
      planned: 0,
      inProgress: 0,
      completed: 0,
      departments: {},
      monthlyDistribution: {}
    };

    trainingList.forEach(training => {
      // Contar por status
      if (training.status === "planned") newStats.planned++;
      if (training.status === "in_progress") newStats.inProgress++;
      if (training.status === "completed") newStats.completed++;

      // Contar por departamento
      if (!newStats.departments[training.department]) {
        newStats.departments[training.department] = 0;
      }
      newStats.departments[training.department]++;

      // Distribuição mensal
      const date = new Date(training.training_date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      if (!newStats.monthlyDistribution[monthYear]) {
        newStats.monthlyDistribution[monthYear] = 0;
      }
      newStats.monthlyDistribution[monthYear]++;
    });

    setStats(newStats);
  };

  // Aplicar filtros
  const handleFilterChange = (filters: TrainingFilters) => {
    let filtered = [...trainings];

    // Filtrar por data inicial
    if (filters.startDate) {
      filtered = filtered.filter(t => 
        new Date(t.training_date) >= filters.startDate!
      );
    }

    // Filtrar por data final
    if (filters.endDate) {
      filtered = filtered.filter(t => 
        new Date(t.training_date) <= filters.endDate!
      );
    }

    // Filtrar por departamento
    if (filters.department) {
      filtered = filtered.filter(t => t.department === filters.department);
    }

    // Filtrar por colaborador
    if (filters.employeeId) {
      filtered = filtered.filter(t => 
        t.participants.some(p => p.id === filters.employeeId)
      );
    }

    // Filtrar por procedimento
    if (filters.procedure) {
      filtered = filtered.filter(t => 
        t.title.includes(filters.procedure) || 
        (t.description && t.description.includes(filters.procedure))
      );
    }

    // Filtrar por termo de pesquisa
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(query) || 
        t.trainer.toLowerCase().includes(query) ||
        (t.description && t.description.toLowerCase().includes(query))
      );
    }

    setFilteredTrainings(filtered);
    calculateStats(filtered);
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
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Novo Treinamento
          </Button>
        </div>
      </div>
      
      {/* Filtros */}
      <TrainingFilterBar 
        departments={departments}
        employees={employees}
        procedures={procedures}
        onFilterChange={handleFilterChange}
      />
      
      {/* Alternância entre dashboard e lista */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total de Treinamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">
                  Treinamentos encontrados
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Planejados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.planned}</div>
                <p className="text-xs text-muted-foreground">
                  Treinamentos agendados
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.inProgress}</div>
                <p className="text-xs text-muted-foreground">
                  Treinamentos em execução
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completed}</div>
                <p className="text-xs text-muted-foreground">
                  Treinamentos concluídos
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Treinamentos por Departamento</CardTitle>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                {Object.keys(stats.departments).length > 0 ? (
                  <div className="w-full h-full">
                    {/* Aqui seria renderizado um gráfico - Visualização simplificada */}
                    <ul className="space-y-2">
                      {Object.entries(stats.departments).map(([dept, count]) => (
                        <li key={dept} className="flex justify-between items-center">
                          <span>{dept}</span>
                          <span className="font-semibold">{count} treinamentos</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nenhum dado para exibir</p>
                )}
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Distribuição Mensal</CardTitle>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                {Object.keys(stats.monthlyDistribution).length > 0 ? (
                  <div className="w-full h-full">
                    {/* Aqui seria renderizado um gráfico - Visualização simplificada */}
                    <ul className="space-y-2">
                      {Object.entries(stats.monthlyDistribution)
                        .sort((a, b) => a[0].localeCompare(b[0]))
                        .map(([month, count]) => (
                          <li key={month} className="flex justify-between items-center">
                            <span>Mês {month}</span>
                            <span className="font-semibold">{count} treinamentos</span>
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nenhum dado para exibir</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Lista de Treinamentos */}
        <TabsContent value="list">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredTrainings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FilePlus className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Nenhum treinamento encontrado</h3>
                <p className="text-muted-foreground text-center mt-2 max-w-md">
                  Não encontramos treinamentos com os filtros atuais. Tente ajustar os filtros ou crie um novo treinamento.
                </p>
                <Button className="mt-6">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Novo Treinamento
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredTrainings.map((training) => (
                <Card key={training.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{training.title}</CardTitle>
                      <div className={`px-2 py-1 text-xs rounded-full font-medium ${
                        training.status === 'planned' 
                          ? 'bg-blue-100 text-blue-800' 
                          : training.status === 'in_progress' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : training.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {training.status === 'planned' 
                          ? 'Planejado' 
                          : training.status === 'in_progress' 
                          ? 'Em Andamento' 
                          : training.status === 'completed'
                          ? 'Concluído'
                          : 'Cancelado'
                        }
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-muted-foreground">Instrutor:</span>
                          <p>{training.trainer}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Departamento:</span>
                          <p>{training.department}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Data:</span>
                          <p>{new Date(training.training_date).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Duração:</span>
                          <p>{training.duration} horas</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-muted-foreground">Descrição:</span>
                          <p>{training.description || "Sem descrição"}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Participantes:</span>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            {training.participants.map((participant, idx) => (
                              <span 
                                key={idx} 
                                className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 rounded-full"
                              >
                                {participant.name}
                              </span>
                            ))}
                          </div>
                        </div>
                        {training.evaluation_method && (
                          <div>
                            <span className="text-sm text-muted-foreground">Método de Avaliação:</span>
                            <p>{training.evaluation_method}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 border-t pt-4">
                    <Button variant="outline" size="sm">
                      <Users className="h-4 w-4 mr-2" />
                      Gerenciar Participantes
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileCheck className="h-4 w-4 mr-2" />
                      Registrar Conclusão
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Certificados
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
