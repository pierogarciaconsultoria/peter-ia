
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle, Award, Calendar, Eye, Plus, Star, Zap } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function PerformanceEvaluation() {
  // Mock data for performance evaluations
  const [evaluations] = useState([
    {
      id: "pe1",
      employee: {
        name: "João Silva",
        position: "Desenvolvedor React",
        department: "Tecnologia",
        avatar: ""
      },
      evaluationPeriod: "2023-H1",
      date: "2023-06-30",
      scores: {
        goals: 92,
        skills: 88,
        overall: 90
      },
      evaluator: "Maria Santos",
      status: "completed"
    },
    {
      id: "pe2",
      employee: {
        name: "Ana Oliveira",
        position: "Analista de RH",
        department: "Recursos Humanos",
        avatar: ""
      },
      evaluationPeriod: "2023-H1",
      date: "2023-06-28",
      scores: {
        goals: 85,
        skills: 90,
        overall: 88
      },
      evaluator: "Carlos Mendes",
      status: "completed"
    },
    {
      id: "pe3",
      employee: {
        name: "Pedro Souza",
        position: "Analista de Marketing",
        department: "Marketing",
        avatar: ""
      },
      evaluationPeriod: "2023-H1",
      date: null,
      scores: null,
      evaluator: null,
      status: "pending"
    },
    {
      id: "pe4",
      employee: {
        name: "Carla Ferreira",
        position: "Assistente Administrativo",
        department: "Administrativo",
        avatar: ""
      },
      evaluationPeriod: "2023-H1",
      date: "2023-07-05",
      scores: {
        goals: 78,
        skills: 82,
        overall: 80
      },
      evaluator: "Roberto Alves",
      status: "completed"
    }
  ]);

  const pendingEvaluations = evaluations.filter(e => e.status === "pending");
  const completedEvaluations = evaluations.filter(e => e.status === "completed");
  
  // Calculate average scores
  const avgScores = completedEvaluations.length > 0 
    ? {
        goals: completedEvaluations.reduce((sum, e) => sum + e.scores.goals, 0) / completedEvaluations.length,
        skills: completedEvaluations.reduce((sum, e) => sum + e.scores.skills, 0) / completedEvaluations.length,
        overall: completedEvaluations.reduce((sum, e) => sum + e.scores.overall, 0) / completedEvaluations.length
      }
    : { goals: 0, skills: 0, overall: 0 };

  // Data for department comparison chart
  const departmentData = [
    { name: 'Tecnologia', score: 90 },
    { name: 'Marketing', score: 84 },
    { name: 'RH', score: 88 },
    { name: 'Financeiro', score: 82 },
    { name: 'Administrativo', score: 80 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pendente</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Concluída</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Em Progresso</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Avaliação de Desempenho</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Avaliação
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Ciclo Atual
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2023-H2</div>
            <p className="text-xs text-muted-foreground">Jul - Dez 2023</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Zap className="h-4 w-4 mr-2" />
                Média Geral
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgScores.overall.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">De 100 pontos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-2" />
                Melhores Avaliações
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedEvaluations.filter(e => e.scores.overall >= 90).length}</div>
            <p className="text-xs text-muted-foreground">Acima de 90 pontos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                Avaliações Pendentes
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingEvaluations.length}</div>
          </CardContent>
        </Card>
      </div>

      {pendingEvaluations.length > 0 && (
        <Alert>
          <Calendar className="h-4 w-4" />
          <AlertTitle>Avaliações Pendentes</AlertTitle>
          <AlertDescription>
            Existem {pendingEvaluations.length} avaliação(ões) de desempenho pendentes no ciclo atual.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Comparativo por Departamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" name="Pontuação Média" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Destaques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedEvaluations
                .sort((a, b) => b.scores.overall - a.scores.overall)
                .slice(0, 3)
                .map((evaluation, index) => (
                  <div key={evaluation.id} className="flex items-center gap-4 p-3 border rounded-md">
                    <div className="flex-shrink-0">
                      {index === 0 && <Award className="h-8 w-8 text-yellow-500" />}
                      {index === 1 && <Award className="h-8 w-8 text-gray-400" />}
                      {index === 2 && <Award className="h-8 w-8 text-amber-700" />}
                    </div>
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={evaluation.employee.avatar} />
                        <AvatarFallback>{evaluation.employee.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{evaluation.employee.name}</p>
                        <p className="text-xs text-muted-foreground">{evaluation.employee.position}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{evaluation.scores.overall}</p>
                      <p className="text-xs text-muted-foreground">Pontos</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Avaliações</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Objetivos</TableHead>
                <TableHead>Competências</TableHead>
                <TableHead>Nota Final</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evaluations.map((evaluation) => (
                <TableRow key={evaluation.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={evaluation.employee.avatar} />
                        <AvatarFallback>{evaluation.employee.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{evaluation.employee.name}</span>
                        <span className="text-xs text-muted-foreground">{evaluation.employee.department}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{evaluation.evaluationPeriod}</TableCell>
                  <TableCell>{evaluation.scores?.goals || "-"}</TableCell>
                  <TableCell>{evaluation.scores?.skills || "-"}</TableCell>
                  <TableCell>
                    <div className="font-semibold">{evaluation.scores?.overall || "-"}</div>
                  </TableCell>
                  <TableCell>{getStatusBadge(evaluation.status)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
