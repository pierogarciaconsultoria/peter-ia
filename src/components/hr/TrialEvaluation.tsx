
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
  UserCheck
} from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Trial evaluation type definition
type EvaluationType = '30_dias' | '45_dias' | '90_dias';

interface TrialEvaluation {
  id: string;
  employee: {
    name: string;
    position: string;
    department: string;
    avatar: string;
  };
  hireDate: string;
  evaluationDate: string | null;
  evaluationType: EvaluationType;
  scores: {
    performance: number;
    adaptation: number;
    behavior: number;
  } | null;
  approved: boolean | null;
  evaluator: string | null;
  status: "pending" | "completed";
}

export function TrialEvaluation() {
  // Mock data for trial period evaluations
  const [trialEvaluations] = useState<TrialEvaluation[]>([
    {
      id: "te1",
      employee: {
        name: "João Silva",
        position: "Desenvolvedor React",
        department: "Tecnologia",
        avatar: ""
      },
      hireDate: "2023-08-15",
      evaluationDate: "2023-09-14",
      evaluationType: "30_dias",
      scores: {
        performance: 80,
        adaptation: 85,
        behavior: 90
      },
      approved: true,
      evaluator: "Maria Santos",
      status: "completed"
    },
    {
      id: "te2",
      employee: {
        name: "João Silva",
        position: "Desenvolvedor React",
        department: "Tecnologia",
        avatar: ""
      },
      hireDate: "2023-08-15",
      evaluationDate: "2023-09-30",
      evaluationType: "45_dias",
      scores: {
        performance: 85,
        adaptation: 90,
        behavior: 95
      },
      approved: true,
      evaluator: "Maria Santos",
      status: "completed"
    },
    {
      id: "te3",
      employee: {
        name: "Ana Oliveira",
        position: "Analista de RH",
        department: "Recursos Humanos",
        avatar: ""
      },
      hireDate: "2023-09-01",
      evaluationDate: "2023-10-15",
      evaluationType: "45_dias",
      scores: {
        performance: 75,
        adaptation: 80,
        behavior: 85
      },
      approved: true,
      evaluator: "Carlos Mendes",
      status: "completed"
    },
    {
      id: "te4",
      employee: {
        name: "Pedro Souza",
        position: "Analista de Marketing",
        department: "Marketing",
        avatar: ""
      },
      hireDate: "2023-09-20",
      evaluationDate: null,
      evaluationType: "30_dias",
      scores: null,
      approved: null,
      evaluator: null,
      status: "pending"
    },
    {
      id: "te5",
      employee: {
        name: "Pedro Souza",
        position: "Analista de Marketing",
        department: "Marketing",
        avatar: ""
      },
      hireDate: "2023-09-20",
      evaluationDate: null,
      evaluationType: "90_dias",
      scores: null,
      approved: null,
      evaluator: null,
      status: "pending"
    },
    {
      id: "te6",
      employee: {
        name: "Carla Ferreira",
        position: "Assistente Administrativo",
        department: "Administrativo",
        avatar: ""
      },
      hireDate: "2023-07-10",
      evaluationDate: "2023-11-05",
      evaluationType: "90_dias",
      scores: {
        performance: 70,
        adaptation: 65,
        behavior: 80
      },
      approved: false,
      evaluator: "Roberto Alves",
      status: "completed"
    }
  ]);

  const [activeTab, setActiveTab] = useState<string>("all");

  // Filter evaluations based on active tab
  const filteredEvaluations = activeTab === "all" 
    ? trialEvaluations 
    : trialEvaluations.filter(e => e.evaluationType === activeTab);
  
  const pendingEvaluations = filteredEvaluations.filter(e => e.status === "pending");
  const completedEvaluations = filteredEvaluations.filter(e => e.status === "completed");
  const approvedCount = completedEvaluations.filter(e => e.approved).length;
  const disapprovedCount = completedEvaluations.filter(e => e.approved === false).length;

  // Group employees by name to track multiple evaluations
  const employeeEvaluationsMap = trialEvaluations.reduce((acc, evaluation) => {
    const name = evaluation.employee.name;
    if (!acc[name]) {
      acc[name] = [];
    }
    acc[name].push(evaluation);
    return acc;
  }, {} as Record<string, TrialEvaluation[]>);

  // Calculate employees with all evaluations completed
  const employeesWithCompleteEvaluations = Object.values(employeeEvaluationsMap).filter(
    evaluations => {
      // Check if employee has at least one 30-day and one 90-day evaluation both completed
      const has30DayCompleted = evaluations.some(e => e.evaluationType === '30_dias' && e.status === 'completed');
      const has90DayCompleted = evaluations.some(e => e.evaluationType === '90_dias' && e.status === 'completed');
      return has30DayCompleted && has90DayCompleted;
    }
  ).length;

  const getStatusBadge = (status: string, approved: boolean | null) => {
    if (status === "pending") {
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pendente</Badge>;
    } else if (approved === true) {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Aprovado</Badge>;
    } else if (approved === false) {
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Não Aprovado</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  const getEvaluationTypeName = (type: EvaluationType) => {
    switch(type) {
      case "30_dias": return "30 Dias";
      case "45_dias": return "45 Dias";
      case "90_dias": return "90 Dias";
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Avaliação de Período de Experiência</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Avaliação
        </Button>
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
                Avaliações Concluídas
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedEvaluations.length}</div>
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
        <h3 className="text-lg font-semibold">Avaliações {activeTab === "all" ? "Recentes" : getEvaluationTypeName(activeTab as EvaluationType)}</h3>
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
              {filteredEvaluations.map((evaluation) => (
                <TableRow key={evaluation.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={evaluation.employee.avatar} />
                        <AvatarFallback>{evaluation.employee.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{evaluation.employee.name}</span>
                        <span className="text-xs text-muted-foreground">{evaluation.employee.position}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(evaluation.hireDate).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{getEvaluationTypeName(evaluation.evaluationType)}</TableCell>
                  <TableCell>{getStatusBadge(evaluation.status, evaluation.approved)}</TableCell>
                  <TableCell>{evaluation.evaluator || "-"}</TableCell>
                  <TableCell>
                    {evaluation.scores ? 
                      ((evaluation.scores.performance + evaluation.scores.adaptation + evaluation.scores.behavior) / 3).toFixed(0) 
                      : "-"
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {evaluation.status === "pending" ? (
                        <Button size="sm">
                          <UserCheck className="h-4 w-4 mr-1" /> Avaliar
                        </Button>
                      ) : (
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
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
