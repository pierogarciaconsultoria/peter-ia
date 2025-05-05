
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  UserPlus,
  Briefcase,
  Users,
  GraduationCap,
  UserCheck,
  LineChart,
  AlertTriangle,
  ArrowRight,
  Clock,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export function HRDashboard() {
  const { toast } = useToast();
  const [data, setData] = useState({
    employeeCount: 0,
    newEmployees: 0,
    openPositions: 0,
    pendingOnboarding: 0,
    pendingEvaluations: 0,
    developmentPlans: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get all active employees count
        const { data: employees, error: employeesError } = await supabase
          .from('employees')
          .select('id')
          .eq('status', 'active');
          
        if (employeesError) throw employeesError;
        
        // Get new employees (hired in the last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const { data: newEmps, error: newEmpsError } = await supabase
          .from('employees')
          .select('id')
          .gte('hire_date', thirtyDaysAgo.toISOString().split('T')[0]);
          
        if (newEmpsError) throw newEmpsError;
        
        // Get open job positions
        const { data: openJobs, error: jobsError } = await supabase
          .from('hr_job_openings')
          .select('id')
          .eq('status', 'open');
          
        if (jobsError) throw jobsError;
        
        // Get pending onboardings
        const { data: onboardings, error: onboardingError } = await supabase
          .from('onboarding_processes')
          .select('id')
          .eq('status', 'in_progress');
          
        if (onboardingError) throw onboardingError;
        
        // Get pending evaluations
        const { data: evaluations, error: evaluationsError } = await supabase
          .from('trial_period_evaluations')
          .select('id')
          .is('approved', null);
          
        if (evaluationsError) throw evaluationsError;
        
        // Get active development plans
        const { data: plans, error: plansError } = await supabase
          .from('development_plans')
          .select('id')
          .eq('status', 'active');
          
        if (plansError) throw plansError;
        
        setData({
          employeeCount: employees?.length || 0,
          newEmployees: newEmps?.length || 0,
          openPositions: openJobs?.length || 0,
          pendingOnboarding: onboardings?.length || 0,
          pendingEvaluations: evaluations?.length || 0,
          developmentPlans: plans?.length || 0,
        });
      } catch (error) {
        console.error("Error fetching HR dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch HR dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);
  
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Total de Colaboradores
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : data.employeeCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Colaboradores ativos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <UserPlus className="h-4 w-4 mr-2" />
                Novas Contratações
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : data.newEmployees}
            </div>
            <p className="text-xs text-muted-foreground">
              Nos últimos 30 dias
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2" />
                Vagas Abertas
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : data.openPositions}
            </div>
            <p className="text-xs text-muted-foreground">
              Processos em andamento
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <UserCheck className="h-4 w-4 mr-2" />
                Onboarding
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : data.pendingOnboarding}
            </div>
            <p className="text-xs text-muted-foreground">
              Processos em andamento
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Avaliações Pendentes
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : data.pendingEvaluations}
            </div>
            <p className="text-xs text-muted-foreground">
              Avaliações de período de experiência
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <GraduationCap className="h-4 w-4 mr-2" />
                PDIs Ativos
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : data.developmentPlans}
            </div>
            <p className="text-xs text-muted-foreground">
              Planos de desenvolvimento individual
            </p>
          </CardContent>
        </Card>
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
      
      {data.pendingEvaluations > 0 && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Ações pendentes</AlertTitle>
          <AlertDescription>
            Existem {data.pendingEvaluations} avaliações de período de experiência aguardando sua análise.
          </AlertDescription>
        </Alert>
      )}
      
      {data.pendingOnboarding > 0 && (
        <Alert>
          <UserCheck className="h-4 w-4" />
          <AlertTitle>Processos de onboarding</AlertTitle>
          <AlertDescription>
            Existem {data.pendingOnboarding} processos de onboarding em andamento.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
