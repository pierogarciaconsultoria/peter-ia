
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
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function EmployeeOnboarding() {
  // Mock data for onboarding processes
  const [onboardingProcesses] = useState([
    {
      id: "onb1",
      employeeName: "Pedro Costa",
      position: "Desenvolvedor Full Stack",
      startDate: "2023-10-15",
      progress: 75,
      status: "em_andamento",
      department: "Tecnologia"
    },
    {
      id: "onb2",
      employeeName: "Mariana Silva",
      position: "Analista de Marketing",
      startDate: "2023-11-05",
      progress: 30,
      status: "em_andamento",
      department: "Marketing"
    },
    {
      id: "onb3",
      employeeName: "Roberto Alves",
      position: "Gerente de Projetos",
      startDate: "2023-09-22",
      progress: 100,
      status: "concluido",
      department: "Operações"
    }
  ]);

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
                    <TableCell>{process.position}</TableCell>
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
                    <TableCell>{process.position}</TableCell>
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
