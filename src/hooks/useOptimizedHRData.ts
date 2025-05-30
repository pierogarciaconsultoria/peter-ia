
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface HRDataCache {
  departments: any[];
  jobPositions: any[];
  applications: any[];
  trainings: any[];
}

export function useOptimizedHRData(companyId?: string) {
  // Cache compartilhado para dados básicos de HR
  const { data: hrData, isLoading, error } = useQuery({
    queryKey: ['hr-data-optimized', companyId],
    queryFn: async (): Promise<HRDataCache> => {
      if (!companyId) throw new Error('Company ID is required');

      // Executar consultas em paralelo usando os índices da Fase 1
      const [departmentsResult, jobPositionsResult, applicationsResult, trainingsResult] = await Promise.all([
        supabase
          .from('departments')
          .select('id, name, description, current_headcount, approved_headcount')
          .eq('company_id', companyId)
          .order('name'),
        
        supabase
          .from('job_positions')
          .select('id, title, department_id, salary_min, salary_max')
          .eq('company_id', companyId)
          .order('title'),
        
        supabase
          .from('hr_applications')
          .select('id, status, application_date, current_stage')
          .eq('company_id', companyId)
          .order('application_date', { ascending: false })
          .limit(50), // Limitar para performance
        
        supabase
          .from('employee_trainings')
          .select('id, employee_id, status, completion_date')
          .eq('company_id', companyId)
          .order('completion_date', { ascending: false })
          .limit(100) // Limitar para performance
      ]);

      if (departmentsResult.error) throw departmentsResult.error;
      if (jobPositionsResult.error) throw jobPositionsResult.error;
      if (applicationsResult.error) throw applicationsResult.error;
      if (trainingsResult.error) throw trainingsResult.error;

      return {
        departments: departmentsResult.data || [],
        jobPositions: jobPositionsResult.data || [],
        applications: applicationsResult.data || [],
        trainings: trainingsResult.data || [],
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutos de cache para dados estruturais
    gcTime: 30 * 60 * 1000, // 30 minutos no garbage collector
    enabled: !!companyId,
  });

  // Dados derivados memoizados
  const stats = useMemo(() => {
    if (!hrData) return null;

    const totalPositions = hrData.departments.reduce((sum, dept) => sum + (dept.approved_headcount || 0), 0);
    const filledPositions = hrData.departments.reduce((sum, dept) => sum + (dept.current_headcount || 0), 0);
    const pendingApplications = hrData.applications.filter(app => app.status === 'received').length;
    const activeTrainings = hrData.trainings.filter(training => training.status === 'in_progress').length;

    return {
      totalPositions,
      filledPositions,
      vacantPositions: totalPositions - filledPositions,
      pendingApplications,
      activeTrainings,
      fillRate: totalPositions > 0 ? Math.round((filledPositions / totalPositions) * 100) : 0
    };
  }, [hrData]);

  return {
    departments: hrData?.departments || [],
    jobPositions: hrData?.jobPositions || [],
    applications: hrData?.applications || [],
    trainings: hrData?.trainings || [],
    stats,
    isLoading,
    error
  };
}
