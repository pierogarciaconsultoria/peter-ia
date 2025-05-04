
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  FileText,
  GraduationCap,
  Handshake,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const JOURNEY_STAGES = [
  { id: 'recruitment', title: 'Recrutamento', icon: Briefcase, route: '?activeTab=recruitment' },
  { id: 'hiring', title: 'Contratação', icon: Handshake, route: '?activeTab=movimentacao' },
  { id: 'onboarding', title: 'Onboarding', icon: UserPlus, route: '?activeTab=onboarding' },
  { id: 'trial', title: 'Período de Experiência', icon: UserCheck, route: '?activeTab=trial' },
  { id: 'development', title: 'Desenvolvimento', icon: GraduationCap, route: '?activeTab=development' }
];

export function EmployeeJourney() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [recentJourneys, setRecentJourneys] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentJourneys = async () => {
      try {
        setIsLoading(true);
        
        // Get recently hired employees (last 60 days)
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
        
        const { data: employees, error: employeeError } = await supabase
          .from('employees')
          .select('id, name, position, department, hire_date')
          .gte('hire_date', sixtyDaysAgo.toISOString().split('T')[0])
          .order('hire_date', { ascending: false })
          .limit(5);
          
        if (employeeError) throw employeeError;
        
        if (!employees || employees.length === 0) {
          setRecentJourneys([]);
          setIsLoading(false);
          return;
        }
        
        // Gather employee IDs to search for related items
        const employeeIds = employees.map(emp => emp.id);
        
        // Get onboarding data
        const { data: onboardings } = await supabase
          .from('onboarding_processes')
          .select('employee_id, status, completion_date')
          .in('employee_id', employeeIds);
        
        // Get trial evaluations
        const { data: evaluations } = await supabase
          .from('trial_period_evaluations')
          .select('employee_id, evaluation_type, approved')
          .in('employee_id', employeeIds);
        
        // Get development plans
        const { data: plans } = await supabase
          .from('development_plans')
          .select('employee_id, status, progress')
          .in('employee_id', employeeIds);
        
        // Map the employees with their journey data
        const employeeJourneys = employees.map(emp => {
          // Check onboarding status
          const onboarding = onboardings?.find(o => o.employee_id === emp.id);
          const onboardingComplete = onboarding?.status === 'completed';
          
          // Check trial period status
          const evaluationsFor45Days = evaluations?.filter(
            e => e.employee_id === emp.id && e.evaluation_type === '45_days'
          );
          const evaluationsFor90Days = evaluations?.filter(
            e => e.employee_id === emp.id && e.evaluation_type === '90_days'
          );
          
          const trial45Complete = evaluationsFor45Days?.some(e => e.approved === true);
          const trial90Complete = evaluationsFor90Days?.some(e => e.approved === true);
          
          // Check development plan status
          const developmentPlan = plans?.find(p => p.employee_id === emp.id);
          const developmentProgress = developmentPlan?.progress || 0;
          
          // Calculate progress through journey
          let stagesPassed = 2; // Recruitment and hiring are done
          if (onboardingComplete) stagesPassed++;
          if (trial45Complete && trial90Complete) stagesPassed++;
          if (developmentProgress > 0) stagesPassed++;
          
          // Calculate days with the company
          const hireDate = new Date(emp.hire_date);
          const today = new Date();
          const daysWithCompany = Math.floor((today.getTime() - hireDate.getTime()) / (1000 * 3600 * 24));
          
          return {
            ...emp,
            onboardingComplete,
            trial45Complete,
            trial90Complete,
            developmentProgress,
            stagesPassed,
            progressPercentage: (stagesPassed / JOURNEY_STAGES.length) * 100,
            daysWithCompany
          };
        });
        
        setRecentJourneys(employeeJourneys);
      } catch (error) {
        console.error("Error fetching employee journey data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch employee journey data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecentJourneys();
  }, [toast]);
  
  const navigateToStage = (route: string) => {
    navigate(`/human-resources${route}`);
  };

  const renderStageStatus = (employee: any, stage: string) => {
    switch(stage) {
      case 'recruitment':
      case 'hiring':
        return <Badge variant="success">Concluído</Badge>;
      
      case 'onboarding':
        return employee.onboardingComplete ? 
          <Badge variant="success">Concluído</Badge> : 
          <Badge>Em andamento</Badge>;
          
      case 'trial':
        if (employee.trial45Complete && employee.trial90Complete) {
          return <Badge variant="success">Concluído</Badge>;
        } else if (employee.trial45Complete) {
          return <Badge>45 dias aprovado</Badge>;
        } else {
          return <Badge variant="outline">Pendente</Badge>;
        }
        
      case 'development':
        if (employee.developmentProgress >= 100) {
          return <Badge variant="success">Concluído</Badge>;
        } else if (employee.developmentProgress > 0) {
          return <Badge>{employee.developmentProgress}% concluído</Badge>;
        } else {
          return <Badge variant="outline">Não iniciado</Badge>;
        }
        
      default:
        return <Badge variant="outline">N/A</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Jornada do Colaborador</CardTitle>
        <CardDescription>
          Visualize e acompanhe as etapas da jornada de cada colaborador
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Journey stages diagram */}
        <div className="grid grid-cols-5 gap-2">
          {JOURNEY_STAGES.map((stage, index) => (
            <div key={stage.id} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
                <stage.icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">{stage.title}</span>
              {index < JOURNEY_STAGES.length - 1 && (
                <ArrowRight className="h-6 w-6 mt-2 -mr-10 text-muted-foreground hidden md:block" />
              )}
            </div>
          ))}
        </div>
        
        {/* Navigation buttons */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {JOURNEY_STAGES.map((stage) => (
            <Button 
              key={stage.id}
              variant="outline"
              size="sm"
              onClick={() => navigateToStage(stage.route)}
              className="text-xs"
            >
              <stage.icon className="h-3 w-3 mr-1" />
              {stage.title}
            </Button>
          ))}
        </div>
        
        {/* Recent employees journey tracking */}
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-medium">Colaboradores Recentes</h3>
          
          {isLoading ? (
            <div className="py-4 text-center text-muted-foreground">
              Carregando dados...
            </div>
          ) : recentJourneys.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p>Não há colaboradores recentes para exibir</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentJourneys.map((employee) => (
                <div key={employee.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-semibold">{employee.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {employee.position} • {employee.department} • {employee.daysWithCompany} dias na empresa
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{Math.round(employee.progressPercentage)}%</span>
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  
                  <Progress value={employee.progressPercentage} className="h-2" />
                  
                  {/* Stage status indicators */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 pt-2">
                    {JOURNEY_STAGES.map((stage) => (
                      <div key={stage.id} className="flex flex-col items-center text-center text-xs">
                        <span className="text-muted-foreground mb-1">{stage.title}</span>
                        {renderStageStatus(employee, stage.id)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
