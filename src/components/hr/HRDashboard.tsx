
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  UserPlus,
  Briefcase,
  Users,
  GraduationCap,
  UserCheck,
  LineChart,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { useHRDashboardMetrics } from "@/hooks/useHRDashboardMetrics";
import { MetricCard } from "./dashboard/MetricCard";
import { DashboardAlerts } from "./dashboard/DashboardAlerts";
import { SystemStatus } from "./dashboard/SystemStatus";

export function HRDashboard() {
  const { metrics, isLoading, errors, refetch } = useHRDashboardMetrics();
  
  return (
    <div className="w-full max-w-full px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard de RH</h2>
        <Button 
          variant="outline" 
          onClick={refetch}
          disabled={isLoading}
        >
          <Clock className="h-4 w-4 mr-2" />
          {isLoading ? "Carregando..." : "Atualizar Dados"}
        </Button>
      </div>

      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Alguns dados não puderam ser carregados</AlertTitle>
          <AlertDescription>
            <div className="mt-2 space-y-1">
              {errors.map((error, index) => (
                <div key={index} className="text-sm">• {error}</div>
              ))}
            </div>
            <div className="mt-2 text-sm">
              Isso pode indicar que algumas tabelas ainda não foram configuradas ou não possuem dados.
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Grid de métricas com responsividade melhorada */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <MetricCard
          title="Total de Colaboradores"
          icon={Users}
          metric={metrics.employeeCount}
          description="Colaboradores ativos"
        />
        
        <MetricCard
          title="Novas Contratações"
          icon={UserPlus}
          metric={metrics.newEmployees}
          description="Nos últimos 30 dias"
        />
        
        <MetricCard
          title="Vagas Abertas"
          icon={Briefcase}
          metric={metrics.openPositions}
          description="Processos em andamento"
        />
        
        <MetricCard
          title="Onboarding"
          icon={UserCheck}
          metric={metrics.pendingOnboarding}
          description="Processos em andamento"
        />
        
        <MetricCard
          title="Avaliações Pendentes"
          icon={AlertTriangle}
          metric={metrics.pendingEvaluations}
          description="Avaliações de período de experiência"
        />
        
        <MetricCard
          title="PDIs Ativos"
          icon={GraduationCap}
          metric={metrics.developmentPlans}
          description="Planos de desenvolvimento individual"
        />
      </div>
      
      <Tabs defaultValue="analytics" className="space-y-4 w-full">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="analytics" className="space-y-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Métricas de RH</CardTitle>
              <CardDescription>
                Indicadores chave de performance do departamento
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <LineChart className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p>Análise de métricas em desenvolvimento</p>
                <p className="text-sm mt-2">Disponível em breve</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <DashboardAlerts 
        pendingEvaluations={metrics.pendingEvaluations}
        pendingOnboarding={metrics.pendingOnboarding}
      />

      <SystemStatus metrics={metrics} errors={errors} />
    </div>
  );
}
