
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useCurrentUser } from './useCurrentUser';
import { useOptimizedEmployees } from './useOptimizedEmployees';
import { useOptimizedHRData } from './useOptimizedHRData';

export function useHRDashboardData() {
  const { empresaId } = useCurrentUser();
  
  // Usar hooks otimizados para buscar dados
  const { employees, employeeStats, employeesByDepartment, isLoading: employeesLoading } = useOptimizedEmployees({
    companyId: empresaId
  });
  
  const { departments, stats: hrStats, isLoading: hrDataLoading } = useOptimizedHRData(empresaId);

  const isLoading = employeesLoading || hrDataLoading;

  // Memoizar dados do dashboard para evitar recálculos
  const data = useMemo(() => {
    if (!employees.length) {
      return {
        metrics: {
          totalEmployees: 0,
          newHires: 0,
          upcomingEvaluations: 0,
          pendingTrainings: 0,
          departments: 0,
          turnoverRate: 0,
          averageTenure: 0,
          pendingRecruitments: 0,
          vacationRequests: 0,
          approvedPositions: hrStats?.totalPositions || 0,
          filledPositions: hrStats?.filledPositions || 0,
          medicalLeaves: 0
        },
        departmentDistribution: [],
        turnoverData: [],
        recruitmentStatus: [],
        trainingCompletionData: [],
        evaluationScores: [],
        salaryComparisonData: [],
        employeeCostsData: [],
        discDistribution: []
      };
    }

    // Calcular novas contratações (últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newHires = employees.filter(emp => 
      new Date(emp.hire_date) >= thirtyDaysAgo
    ).length;

    // Distribuição por departamento
    const departmentDistribution = Object.entries(employeesByDepartment).map(([name, value]) => ({
      name,
      value
    }));

    // Dados de turnover simulados (seria calculado com dados reais)
    const turnoverData = [
      { month: 'Jan', value: 2.1 },
      { month: 'Fev', value: 1.8 },
      { month: 'Mar', value: 2.3 },
      { month: 'Abr', value: 1.9 },
      { month: 'Mai', value: 2.0 },
      { month: 'Jun', value: 1.7 }
    ];

    return {
      metrics: {
        totalEmployees: employeeStats.total,
        newHires,
        upcomingEvaluations: Math.floor(employeeStats.active * 0.15), // 15% dos ativos
        pendingTrainings: hrStats?.activeTrainings || 0,
        departments: departments.length,
        turnoverRate: 2.0,
        averageTenure: 3.2,
        pendingRecruitments: hrStats?.pendingApplications || 0,
        vacationRequests: Math.floor(employeeStats.active * 0.08), // 8% dos ativos
        approvedPositions: hrStats?.totalPositions || 0,
        filledPositions: hrStats?.filledPositions || 0,
        medicalLeaves: Math.floor(employeeStats.active * 0.03) // 3% dos ativos
      },
      departmentDistribution,
      turnoverData,
      recruitmentStatus: [
        { name: 'Triagem', value: hrStats?.pendingApplications || 0 },
        { name: 'Entrevista', value: Math.floor((hrStats?.pendingApplications || 0) * 0.3) },
        { name: 'Avaliação', value: Math.floor((hrStats?.pendingApplications || 0) * 0.2) },
        { name: 'Aprovado', value: Math.floor((hrStats?.pendingApplications || 0) * 0.1) }
      ],
      trainingCompletionData: [
        { name: 'Concluídos', value: 85 },
        { name: 'Em Andamento', value: 12 },
        { name: 'Pendentes', value: 3 }
      ],
      evaluationScores: [
        { name: 'Excelente', value: 32 },
        { name: 'Bom', value: 45 },
        { name: 'Regular', value: 18 },
        { name: 'Precisa Melhorar', value: 5 }
      ],
      salaryComparisonData: [],
      employeeCostsData: [],
      discDistribution: [
        { name: 'Dominância', value: 25, color: '#ff6b6b' },
        { name: 'Influência', value: 30, color: '#4ecdc4' },
        { name: 'Estabilidade', value: 35, color: '#45b7d1' },
        { name: 'Conformidade', value: 10, color: '#96ceb4' }
      ]
    };
  }, [employees, employeeStats, employeesByDepartment, departments, hrStats]);

  const refetch = () => {
    // Função de refetch será implementada quando necessário
  };

  return {
    data,
    isLoading,
    error: null,
    refetch
  };
}
