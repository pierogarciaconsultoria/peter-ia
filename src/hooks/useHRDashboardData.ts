
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

        // Fetch all metrics concurrently
        const [
          employeesResult,
          jobOpeningsResult,
          applicationsResult,
          interviewsResult,
          trialsResult,
          onboardingResult
        ] = await Promise.all([
          // Total employees
          supabase
            .from('employees')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', userCompany.id)
            .eq('status', 'active'),
          
          // Active job openings
          supabase
            .from('hr_job_openings')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', userCompany.id)
            .eq('status', 'open'),
          
          // Pending applications
          supabase
            .from('hr_applications')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', userCompany.id)
            .in('status', ['received', 'screening', 'interview_scheduled']),
          
          // Scheduled interviews (applications in interview stage)
          supabase
            .from('hr_applications')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', userCompany.id)
            .eq('current_stage', 'interview'),
          
          // Pending trial evaluations
          supabase
            .from('trial_period_evaluations')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', userCompany.id)
            .is('approved', null)
            .lte('evaluation_date', new Date().toISOString().split('T')[0]),
          
          // Active onboarding processes
          supabase
            .from('onboarding_processes')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', userCompany.id)
            .eq('status', 'pending')
        ]);

        // Check for errors in any of the queries
        const errors = [
          employeesResult.error,
          jobOpeningsResult.error,
          applicationsResult.error,
          interviewsResult.error,
          trialsResult.error,
          onboardingResult.error
        ].filter(Boolean);

        if (errors.length > 0) {
          console.error('HR Dashboard errors:', errors);
          // Don't throw error, just use 0 for failed queries
        }

        setMetrics({
          totalEmployees: employeesResult.count || 0,
          activeJobs: jobOpeningsResult.count || 0,
          pendingApplications: applicationsResult.count || 0,
          scheduledInterviews: interviewsResult.count || 0,
          trialEvaluations: trialsResult.count || 0,
          onboardingProcesses: onboardingResult.count || 0,
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

  return { metrics, loading, error };
};
