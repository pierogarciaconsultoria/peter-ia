
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Users, Award, GraduationCap, AlertTriangle } from "lucide-react";
import { MaturityThermometer } from "@/components/MaturityThermometer";

export function HRDashboard() {
  // These would come from the API in a real implementation
  const metrics = {
    totalEmployees: 42,
    newHires: 3,
    upcomingEvaluations: 5,
    pendingTrainings: 8,
    departments: 6
  };

  // Mock data for maturity calculation
  const modulesCompletion = [
    { module: "Recrutamento e Seleção", completion: 75, weight: 0.2 },
    { module: "Onboarding", completion: 60, weight: 0.15 },
    { module: "Avaliações", completion: 45, weight: 0.2 },
    { module: "Desenvolvimento", completion: 30, weight: 0.25 },
    { module: "Processos de Saída", completion: 50, weight: 0.2 },
  ];
  
  // Calculate overall score
  const completionScore = modulesCompletion.reduce(
    (sum, module) => sum + (module.completion * module.weight), 0
  );
  
  const goalsAchievement = 65; // Mock data for goals achievement
  
  // Final maturity score (70% from modules completion, 30% from goals)
  const maturityScore = Math.round((completionScore * 0.7) + (goalsAchievement * 0.3));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Funcionários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              +{metrics.newHires} novos este mês
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departamentos</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-network h-4 w-4 text-muted-foreground"><rect x="16" y="16" width="6" height="6" rx="1" /><rect x="2" y="16" width="6" height="6" rx="1" /><rect x="9" y="2" width="6" height="6" rx="1" /><path d="M5 16v-4h14v4" /><path d="M12 12V8" /></svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.departments}</div>
            <p className="text-xs text-muted-foreground">
              Across various functions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliações Pendentes</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.upcomingEvaluations}</div>
            <p className="text-xs text-muted-foreground">
              Próximas duas semanas
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Treinamentos</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pendingTrainings}</div>
            <p className="text-xs text-muted-foreground">
              Pendentes de realização
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <div className="md:col-span-5">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Atenção</AlertTitle>
            <AlertDescription>
              Existem 3 funcionários com avaliações de desempenho atrasadas. 
              Verifique a aba "Avaliações" para mais detalhes.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Departamento</CardTitle>
            <CardDescription>Funcionários por departamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center border-2 border-dashed rounded-md">
              <p className="text-muted-foreground">Gráfico de distribuição por departamento</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Turnover</CardTitle>
            <CardDescription>Últimos 12 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center border-2 border-dashed rounded-md">
              <p className="text-muted-foreground">Gráfico de turnover</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
