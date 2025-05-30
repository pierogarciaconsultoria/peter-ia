
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MetricStatus {
  value: number;
  status: 'success' | 'error' | 'pending';
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

export function useHRDashboardMetrics() {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    employeeCount: { value: 0, status: 'pending' },
    newEmployees: { value: 0, status: 'pending' },
    openPositions: { value: 0, status: 'pending' },
    pendingOnboarding: { value: 0, status: 'pending' },
    pendingEvaluations: { value: 0, status: 'pending' },
    developmentPlans: { value: 0, status: 'pending' },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  
  const updateMetric = (key: keyof DashboardMetrics, value: number, status: 'success' | 'error' | 'pending', error?: string) => {
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
  
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setErrors([]);
      
      console.log("🚀 Starting HR dashboard data fetch...");
      
      // Reset all metrics to pending state
      Object.keys(metrics).forEach(key => {
        updateMetric(key as keyof DashboardMetrics, 0, 'pending');
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

  useEffect(() => {
    fetchData();
  }, []);

  return {
    metrics,
    isLoading,
    errors,
    refetch: fetchData
  };
}
