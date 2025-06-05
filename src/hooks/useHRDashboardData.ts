
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface HRMetrics {
  totalEmployees: number;
  activeJobs: number;
  pendingApplications: number;
  scheduledInterviews: number;
  trialEvaluations: number;
  onboardingProcesses: number;
}

export const useHRDashboardData = () => {
  const [metrics, setMetrics] = useState<HRMetrics>({
    totalEmployees: 0,
    activeJobs: 0,
    pendingApplications: 0,
    scheduledInterviews: 0,
    trialEvaluations: 0,
    onboardingProcesses: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userCompany } = useAuth();

  const fetchMetrics = async () => {
    if (!userCompany?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Buscar métricas básicas de funcionários
      const { data: employeesData, error: employeesError } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', userCompany.id)
        .eq('status', 'active');

      if (employeesError) {
        console.error('Error fetching employees:', employeesError);
      }

      // Para outras métricas, usar valores padrão até as tabelas serem criadas
      setMetrics({
        totalEmployees: employeesData?.length || 0,
        activeJobs: 0,
        pendingApplications: 0,
        scheduledInterviews: 0,
        trialEvaluations: 0,
        onboardingProcesses: 0,
      });

    } catch (err: any) {
      console.error('Error fetching HR metrics:', err);
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [userCompany?.id]);

  const refetch = async () => {
    await fetchMetrics();
  };

  return { 
    metrics, 
    loading, 
    error,
    data: {
      metrics,
      data: {
        departmentDistribution: [],
        turnoverData: [],
        recruitmentStatus: [],
        trainingCompletionData: [],
        evaluationScores: [],
        salaryComparisonData: [],
        employeeCostsData: [],
        discDistribution: []
      }
    },
    isLoading: loading,
    refetch 
  };
};
