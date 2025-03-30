
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AreaChart, 
  BarChart4, 
  FileText, 
  GraduationCap, 
  Plus,
  Target,
  TrendingUp 
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
import { Progress } from "@/components/ui/progress";

export function DevelopmentPlans() {
  // Mock data for development plans
  const [developmentPlans] = useState([
    {
      id: "pdp1",
      employeeName: "Marcos Santos",
      position: "Analista de Sistemas",
      startDate: "2023-08-15",
      endDate: "2024-02-15",
      progress: 65,
      status: "em_andamento",
      goals: ["Certificação AWS", "Liderança de projetos"],
      department: "Tecnologia"
    },
    {
      id: "pdp2",
      employeeName: "Juliana Costa",
      position: "Gerente de Marketing",
      startDate: "2023-07-01",
      endDate: "2023-12-31",
      progress: 85,
      status: "em_andamento",
      goals: ["Gestão de equipes", "Marketing Digital avançado"],
      department: "Marketing"
    },
    {
      id: "pdp3",
      employeeName: "Felipe Almeida",
      position: "Desenvolvedor Frontend",
      startDate: "2023-09-10",
      endDate: "2024-03-10",
      progress: 40,
      status: "em_andamento",
      goals: ["React avançado", "UX/UI para desenvolvedores"],
      department: "Tecnologia"
    },
    {
      id: "pdp4",
      employeeName: "Roberta Silva",
      position: "Analista de Recursos Humanos",
      startDate: "2023-06-01",
      endDate: "2023-11-30",
      progress: 100,
      status: "concluido",
      goals: ["Legislação Trabalhista", "E-Social"],
      department: "RH"
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "em_andamento":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Em Andamento</Badge>;
      case "concluido":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Concluído</Badge>;
      case "nao_iniciado":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Não Iniciado</Badge>;
      case "atrasado":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Atrasado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Planos de Desenvolvimento Individual</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Plano de Desenvolvimento
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Total de PDIs
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{developmentPlans.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Em Andamento
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{developmentPlans.filter(p => p.status === "em_andamento").length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <GraduationCap className="h-4 w-4 mr-2" />
                Concluídos
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{developmentPlans.filter(p => p.status === "concluido").length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <BarChart4 className="h-4 w-4 mr-2" />
                Progresso Médio
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(developmentPlans.reduce((acc, plan) => acc + plan.progress, 0) / developmentPlans.length)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {developmentPlans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <CardTitle>{plan.employeeName}</CardTitle>
              <CardDescription>{plan.position} - {plan.department}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <span>{getStatusBadge(plan.status)}</span>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progresso:</span>
                  <span>{plan.progress}%</span>
                </div>
                <Progress value={plan.progress} className="h-2" />
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Objetivos de desenvolvimento:</p>
                <ul className="list-disc pl-4 text-sm">
                  {plan.goals.map((goal, index) => (
                    <li key={index}>{goal}</li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-between text-sm">
                <div>
                  <span className="text-muted-foreground">Início:</span>
                  <span className="ml-1">{new Date(plan.startDate).toLocaleDateString('pt-BR')}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Fim:</span>
                  <span className="ml-1">{new Date(plan.endDate).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Ver Detalhes
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="rounded-md border mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Funcionário</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Progresso</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {developmentPlans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">{plan.employeeName}</TableCell>
                <TableCell>{plan.position}</TableCell>
                <TableCell>{plan.department}</TableCell>
                <TableCell>{new Date(plan.startDate).toLocaleDateString('pt-BR')} a {new Date(plan.endDate).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={plan.progress} className="h-2 w-24" />
                    <span className="text-xs">{plan.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(plan.status)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Detalhes</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
