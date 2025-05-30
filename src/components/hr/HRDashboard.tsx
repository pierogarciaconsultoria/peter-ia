import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  UserPlus,
  Briefcase,
  Users,
  GraduationCap,
  UserCheck,
  LineChart,
  AlertTriangle,
  Clock,
  Database,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface MetricStatus {
  value: number;
  status: 'success' | 'error' | 'loading';
  error?: string;
}

interface DashboardMetrics {
  employeeCount: MetricStatus;
  newEmployees: MetricStatus;
  openPositions: MetricStatus;
  pendingOnboarding: MetricStatus;
  pendingEvaluations: MetricStatus;
  developmentPlans: MetricStatus;
}

export function HRDashboard() {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    employeeCount: { value: 0, status: 'loading' },
    newEmployees: { value: 0, status: 'loading' },
    openPositions: { value: 0, status: 'loading' },
    pendingOnboarding: { value: 0, status: 'loading' },
    pendingEvaluations: { value: 0, status: 'loading' },
    developmentPlans: { value: 0, status: 'loading' },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  
  const updateMetric = (key: keyof DashboardMetrics, value: number, status: 'success' | 'error', error?: string) => {
    setMetrics(prev => ({
      ...prev,
      [key]: { value, status, error }
    }));
  };

  const fetchMetricSafely = async (
    metricName: keyof DashboardMetrics,
    queryFn: () => Promise<any>,
    description: string
  ) => {
    try {
      console.log(`Fetching ${description}...`);
      const result = await queryFn();
      const count = result?.data?.length || 0;
      updateMetric(metricName, count, 'success');
      console.log(`✅ ${description}: ${count}`);
    } catch (error: any) {
      console.error(`❌ Error fetching ${description}:`, error);
      updateMetric(metricName, 0, 'error', error.message);
      setErrors(prev => [...prev, `${description}: ${error.message}`]);
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setErrors([]);
        
        console.log("🚀 Starting HR dashboard data fetch...");
        
        // Reset all metrics to loading state
        Object.keys(metrics).forEach(key => {
          updateMetric(key as keyof DashboardMetrics, 0, 'loading');
        });

        // Fetch each metric independently with error handling
        await Promise.allSettled([
          // Active employees count
          fetchMetricSafely(
            'employeeCount',
            async () => {
              const { data, error } = await supabase
                .from('employees')
                .select('id', { count: 'exact' })
                .eq('status', 'active');
              if (error) throw error;
              return { data };
            },
            'Active employees'
          ),

          // New employees (hired in the last 30 days)
          fetchMetricSafely(
            'newEmployees',
            async () => {
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
              const { data, error } = await supabase
                .from('employees')
                .select('id', { count: 'exact' })
                .gte('hire_date', thirtyDaysAgo.toISOString().split('T')[0]);
              if (error) throw error;
              return { data };
            },
            'New employees (last 30 days)'
          ),

          // Open job positions
          fetchMetricSafely(
            'openPositions',
            async () => {
              const { data, error } = await supabase
                .from('hr_job_openings')
                .select('id', { count: 'exact' })
                .eq('status', 'open');
              if (error) throw error;
              return { data };
            },
            'Open job positions'
          ),

          // Pending onboardings
          fetchMetricSafely(
            'pendingOnboarding',
            async () => {
              const { data, error } = await supabase
                .from('onboarding_processes')
                .select('id', { count: 'exact' })
                .eq('status', 'in_progress');
              if (error) throw error;
              return { data };
            },
            'Pending onboarding processes'
          ),

          // Pending evaluations
          fetchMetricSafely(
            'pendingEvaluations',
            async () => {
              const { data, error } = await supabase
                .from('trial_period_evaluations')
                .select('id', { count: 'exact' })
                .is('approved', null);
              if (error) throw error;
              return { data };
            },
            'Pending trial evaluations'
          ),

          // Development plans
          fetchMetricSafely(
            'developmentPlans',
            async () => {
              const { data, error } = await supabase
                .from('development_plans')
                .select('id', { count: 'exact' })
                .eq('status', 'active');
              if (error) throw error;
              return { data };
            },
            'Active development plans'
          ),
        ]);

        console.log("✅ HR dashboard data fetch completed");
      } catch (error: any) {
        console.error("❌ Critical error in HR dashboard:", error);
        toast({
          title: "Erro",
          description: "Erro crítico ao carregar dados do dashboard de RH",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  const MetricCard = ({ 
    title, 
    icon: Icon, 
    metric, 
    description 
  }: { 
    title: string; 
    icon: any; 
    metric: MetricStatus; 
    description: string; 
  }) => (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Icon className="h-4 w-4 mr-2" />
              {title}
            </div>
            {metric.status === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
            {metric.status === 'error' && <XCircle className="h-4 w-4 text-red-500" />}
            {metric.status === 'loading' && <Clock className="h-4 w-4 text-yellow-500 animate-spin" />}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {metric.status === 'loading' ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <>
              {metric.value}
              {metric.status === 'error' && (
                <Badge variant="destructive" className="ml-2 text-xs">
                  Erro
                </Badge>
              )}
            </>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
        {metric.status === 'error' && metric.error && (
          <p className="text-xs text-red-500 mt-1">
            {metric.error}
          </p>
        )}
      </CardContent>
    </Card>
  );
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard de RH</h2>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      
      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
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
      
      {metrics.pendingEvaluations.status === 'success' && metrics.pendingEvaluations.value > 0 && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Ações pendentes</AlertTitle>
          <AlertDescription>
            Existem {metrics.pendingEvaluations.value} avaliações de período de experiência aguardando sua análise.
          </AlertDescription>
        </Alert>
      )}
      
      {metrics.pendingOnboarding.status === 'success' && metrics.pendingOnboarding.value > 0 && (
        <Alert>
          <UserCheck className="h-4 w-4" />
          <AlertTitle>Processos de onboarding</AlertTitle>
          <AlertDescription>
            Existem {metrics.pendingOnboarding.value} processos de onboarding em andamento.
          </AlertDescription>
        </Alert>
      )}

      {/* Status geral do sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Status do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Conectividade com banco de dados</span>
              <Badge variant="outline" className="text-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Online
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Métricas carregadas com sucesso</span>
              <Badge variant="outline">
                {Object.values(metrics).filter(m => m.status === 'success').length}/6
              </Badge>
            </div>
            {errors.length > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span>Tabelas com problemas</span>
                <Badge variant="destructive">
                  {errors.length}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
