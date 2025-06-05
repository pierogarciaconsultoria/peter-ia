
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

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!userCompany?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch all metrics concurrently with fallback for missing tables
        const [
          employeesResult,
          jobOpeningsResult,
          applicationsResult,
          interviewsResult,
          trialsResult,
          onboardingResult
        ] = await Promise.allSettled([
          // Total employees
          supabase
            .from('employees')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', userCompany.id)
            .eq('status', 'active'),
          
          // Active job openings - with fallback
          supabase
            .from('hr_job_openings')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', userCompany.id)
            .eq('status', 'open')
            .then(result => result)
            .catch(() => ({ count: 0, error: null })),
          
          // Pending applications - with fallback
          supabase
            .from('hr_applications')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', userCompany.id)
            .in('status', ['received', 'screening', 'interview_scheduled'])
            .then(result => result)
            .catch(() => ({ count: 0, error: null })),
          
          // Scheduled interviews - with fallback
          supabase
            .from('hr_applications')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', userCompany.id)
            .eq('current_stage', 'interview')
            .then(result => result)
            .catch(() => ({ count: 0, error: null })),
          
          // Pending trial evaluations - with fallback
          supabase
            .from('trial_period_evaluations')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', userCompany.id)
            .is('approved', null)
            .lte('evaluation_date', new Date().toISOString().split('T')[0])
            .then(result => result)
            .catch(() => ({ count: 0, error: null })),
          
          // Active onboarding processes - with fallback
          supabase
            .from('onboarding_processes')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', userCompany.id)
            .eq('status', 'pending')
            .then(result => result)
            .catch(() => ({ count: 0, error: null }))
        ]);

        // Extract counts with safe fallbacks
        const getCount = (result: PromiseSettledResult<any>) => {
          if (result.status === 'fulfilled' && result.value && !result.value.error) {
            return result.value.count || 0;
          }
          return 0;
        };

        setMetrics({
          totalEmployees: getCount(employeesResult),
          activeJobs: getCount(jobOpeningsResult),
          pendingApplications: getCount(applicationsResult),
          scheduledInterviews: getCount(interviewsResult),
          trialEvaluations: getCount(trialsResult),
          onboardingProcesses: getCount(onboardingResult),
        });

      } catch (err: any) {
        console.error('Error fetching HR metrics:', err);
        setError('Erro ao carregar dados do dashboard');
      } finally {
        setLoading(false);
      }
    };

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
      departmentDistribution: [],
      turnoverData: [],
      recruitmentStatus: [],
      trainingCompletionData: [],
      evaluationScores: [],
      salaryComparisonData: [],
      employeeCostsData: [],
      discDistribution: []
    },
    isLoading: loading,
    refetch 
  };
};
