
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
import { useDevelopmentPlans } from "@/hooks/useDevelopmentPlans";
import { DevelopmentPlanForm } from "./development/DevelopmentPlanForm";

export function DevelopmentPlans() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    developmentPlans,
    loading,
    addDevelopmentPlan,
    updateDevelopmentPlan,
    deleteDevelopmentPlan,
  } = useDevelopmentPlans();

  const handleAddPlan = async (data: any) => {
    try {
      await addDevelopmentPlan(data);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding development plan:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Ativo</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Concluído</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-48">
      <p>Carregando planos de desenvolvimento...</p>
    </div>;
  }

  const activePlans = developmentPlans.filter(p => p.status === "active");
  const completedPlans = developmentPlans.filter(p => p.status === "completed");
  const averageProgress = developmentPlans.length > 0 
    ? Math.round(developmentPlans.reduce((acc, plan) => acc + plan.progress, 0) / developmentPlans.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Planos de Desenvolvimento Individual</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
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
            <div className="text-2xl font-bold">{activePlans.length}</div>
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
            <div className="text-2xl font-bold">{completedPlans.length}</div>
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
            <div className="text-2xl font-bold">{averageProgress}%</div>
          </CardContent>
        </Card>
      </div>

      {developmentPlans.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum plano ainda</h3>
            <p className="text-muted-foreground mb-4">
              Comece criando o primeiro plano de desenvolvimento.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Plano
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {developmentPlans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <CardTitle>{plan.employee?.name || 'Funcionário'}</CardTitle>
                  <CardDescription>{plan.employee?.position || 'Cargo'} - {plan.employee?.department || 'Departamento'}</CardDescription>
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
                    <p className="text-sm text-muted-foreground">Plano:</p>
                    <p className="text-sm font-medium">{plan.title}</p>
                  </div>
                  
                  {plan.career_goal && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Objetivo de carreira:</p>
                      <p className="text-sm">{plan.career_goal}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <div>
                      <span className="text-muted-foreground">Início:</span>
                      <span className="ml-1">{new Date(plan.start_date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Fim:</span>
                      <span className="ml-1">{new Date(plan.end_date).toLocaleDateString('pt-BR')}</span>
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
                    <TableCell className="font-medium">{plan.employee?.name || 'Funcionário'}</TableCell>
                    <TableCell>{plan.employee?.position || 'Cargo'}</TableCell>
                    <TableCell>{plan.employee?.department || 'Departamento'}</TableCell>
                    <TableCell>{new Date(plan.start_date).toLocaleDateString('pt-BR')} a {new Date(plan.end_date).toLocaleDateString('pt-BR')}</TableCell>
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
        </>
      )}

      <DevelopmentPlanForm 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onSubmit={handleAddPlan}
      />
    </div>
  );
}
