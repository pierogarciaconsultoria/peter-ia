
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Employee } from '@/services/employee/types';

interface UseOptimizedEmployeesOptions {
  companyId?: string;
  department?: string;
  status?: string;
  searchTerm?: string;
}

export function useOptimizedEmployees(options: UseOptimizedEmployeesOptions = {}) {
  const { companyId, department, status = 'active', searchTerm } = options;

  // Cache key baseado nos parâmetros para evitar refetch desnecessário
  const queryKey = useMemo(() => [
    'employees-optimized',
    companyId,
    department,
    status,
    searchTerm
  ], [companyId, department, status, searchTerm]);

  const { data: employees = [], isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      let query = supabase
        .from('employees')
        .select(`
          id,
          name,
          email,
          position,
          department,
          status,
          hire_date,
          salary,
          phone,
          avatar_url,
          job_position_id,
          department_id,
          immediate_supervisor_id
        `);

      // Usar índices criados na Fase 1
      if (companyId) {
        query = query.eq('company_id', companyId);
      }
      
      if (status) {
        query = query.eq('status', status);
      }

      if (department) {
        query = query.eq('department', department);
      }

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,position.ilike.%${searchTerm}%`);
      }

      // Otimizar ordenação usando índice
      query = query.order('name');

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Employee[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos de cache
    gcTime: 10 * 60 * 1000, // 10 minutos no garbage collector
    enabled: !!companyId, // Só executa se tiver companyId
  });

  // Memoização de dados derivados
  const employeeStats = useMemo(() => {
    if (!employees.length) return { total: 0, active: 0, inactive: 0 };
    
    return {
      total: employees.length,
      active: employees.filter(emp => emp.status === 'active').length,
      inactive: employees.filter(emp => emp.status !== 'active').length,
    };
  }, [employees]);

  const employeesByDepartment = useMemo(() => {
    return employees.reduce((acc, emp) => {
      const dept = emp.department || 'Sem Departamento';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [employees]);

  return {
    employees,
    employeeStats,
    employeesByDepartment,
    isLoading,
    error,
    refetch
  };
}
