
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2,
  Clock,
  FileCheck,
  FileText,
  ListChecks, 
  Plus,
  User
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

// Types for job positions
interface JobPosition {
  id: string;
  title: string;
  department: string;
  description: string;
}

// Types for onboarding process
interface OnboardingProcess {
  id: string;
  employeeName: string;
  position: string;
  position_id?: string;
  position_details?: JobPosition;
  startDate: string;
  progress: number;
  status: string;
  department: string;
}

export function EmployeeOnboarding() {
  const [onboardingProcesses, setOnboardingProcesses] = useState<OnboardingProcess[]>([]);
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch job positions and onboarding processes
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
        
        // For demo, we'll use mock data for onboarding processes
        // but in a real app we'd fetch from the database
        const mockOnboardingData = [
          {
            id: "onb1",
            employeeName: "Pedro Costa",
            position: "Desenvolvedor Full Stack",
            position_id: "pos1",
            startDate: "2023-10-15",
            progress: 75,
            status: "em_andamento",
            department: "Tecnologia"
          },
          {
            id: "onb2",
            employeeName: "Mariana Silva",
            position: "Analista de Marketing",
            position_id: "pos2",
            startDate: "2023-11-05",
            progress: 30,
            status: "em_andamento",
            department: "Marketing"
          },
          {
            id: "onb3",
            employeeName: "Roberto Alves",
            position: "Gerente de Projetos",
            position_id: "pos3",
            startDate: "2023-09-22",
            progress: 100,
            status: "concluido",
            department: "Operações"
          }
        ];
        
        // Merge onboarding data with job position details
        const enrichedOnboarding = mockOnboardingData.map(process => {
          const positionDetails = positionsData?.find(p => p.id === process.position_id);
          return {
            ...process,
            position_details: positionDetails
          };
        });
        
        setOnboardingProcesses(enrichedOnboarding);
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
      case "em_andamento":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Em Andamento</Badge>;
      case "concluido":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Concluído</Badge>;
      case "pendente":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pendente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-muted-foreground">Carregando processos de onboarding...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Onboarding de Funcionários</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Onboarding
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Onboardings Ativos
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onboardingProcesses.filter(p => p.status === "em_andamento").length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Novos Funcionários (Mês)
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Onboardings Concluídos
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onboardingProcesses.filter(p => p.status === "concluido").length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="active">Em Andamento</TabsTrigger>
          <TabsTrigger value="completed">Concluídos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <div className="rounded-md border mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Funcionário</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Data de Início</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {onboardingProcesses.map((process) => (
                  <TableRow key={process.id}>
                    <TableCell className="font-medium">{process.employeeName}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{process.position}</span>
                        {process.position_id && (
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">
                              Cód: {process.position_id}
                            </span>
                            {process.position_details && (
                              <span className="text-xs text-muted-foreground line-clamp-1">
                                {process.position_details.description}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{process.department}</TableCell>
                    <TableCell>{new Date(process.startDate).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{getStatusBadge(process.status)}</TableCell>
                    <TableCell>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full" 
                          style={{ width: `${process.progress}%` }}>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{process.progress}%</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <ListChecks className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="active" className="pt-4">
          <div className="rounded-md border mt-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Funcionário</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Data de Início</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {onboardingProcesses
                  .filter(p => p.status === "em_andamento")
                  .map((process) => (
                  <TableRow key={process.id}>
                    <TableCell className="font-medium">{process.employeeName}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{process.position}</span>
                        {process.position_id && (
                          <span className="text-xs text-muted-foreground">
                            Cód: {process.position_id}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(process.startDate).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full" 
                          style={{ width: `${process.progress}%` }}>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{process.progress}%</span>
                    </TableCell>
                    <TableCell>
                      <Button size="sm">Ver Checklist</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="completed" className="pt-4">
          <div className="rounded-md border mt-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Funcionário</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Concluído em</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {onboardingProcesses
                  .filter(p => p.status === "concluido")
                  .map((process) => (
                  <TableRow key={process.id}>
                    <TableCell className="font-medium">{process.employeeName}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{process.position}</span>
                        {process.position_id && (
                          <span className="text-xs text-muted-foreground">
                            Cód: {process.position_id}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{new Date().toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <FileCheck className="h-4 w-4 mr-2" />
                        Relatório
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
