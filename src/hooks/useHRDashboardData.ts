
import { useState, useEffect } from 'react';
import { HRDashboardData } from '@/components/hr/dashboard/HRDashboardProvider';
import { useToast } from '@/hooks/use-toast';

// This is a placeholder for a real API service
const fetchHRDashboardData = async (): Promise<HRDashboardData> => {
  // In a real application, you would make an API call here
  // For now, we just simulate a delay and return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        metrics: {
          totalEmployees: 42,
          newHires: 3,
          upcomingEvaluations: 5,
          pendingTrainings: 8,
          departments: 6,
          turnoverRate: 4.2,
          averageTenure: 2.7,
          pendingRecruitments: 3,
          vacationRequests: 2,
          approvedPositions: 48,
          filledPositions: 42,
          medicalLeaves: 1
        },
        departmentDistribution: [
          { name: 'Administrativo', value: 10 },
          { name: 'Comercial', value: 8 },
          { name: 'Financeiro', value: 6 },
          { name: 'Produção', value: 12 },
          { name: 'TI', value: 4 },
          { name: 'RH', value: 2 }
        ],
        turnoverData: [
          { month: 'Jan', value: 2.1 },
          { month: 'Fev', value: 1.8 },
          { month: 'Mar', value: 3.2 },
          { month: 'Abr', value: 2.7 },
          { month: 'Mai', value: 3.8 },
          { month: 'Jun', value: 4.2 }
        ],
        recruitmentStatus: [
          { name: 'Abertas', value: 3 },
          { name: 'Em processo', value: 5 },
          { name: 'Concluídas', value: 4 }
        ],
        trainingCompletionData: [
          { name: 'Completos', value: 28 },
          { name: 'Em progresso', value: 12 },
          { name: 'Não iniciados', value: 8 }
        ],
        evaluationScores: [
          { name: 'Excelente', value: 15 },
          { name: 'Bom', value: 18 },
          { name: 'Regular', value: 7 },
          { name: 'Precisa melhorar', value: 2 }
        ],
        salaryComparisonData: [
          { position: 'Dev Junior', 'Empresa': 4200, 'Mercado': 4500 },
          { position: 'Dev Pleno', 'Empresa': 6500, 'Mercado': 7000 },
          { position: 'Dev Senior', 'Empresa': 10000, 'Mercado': 11000 },
          { position: 'Analista RH', 'Empresa': 3800, 'Mercado': 3500 },
          { position: 'Gerente', 'Empresa': 12000, 'Mercado': 13500 }
        ],
        employeeCostsData: [
          { month: 'Jan', salaries: 150000, benefits: 45000, taxes: 60000 },
          { month: 'Fev', salaries: 152000, benefits: 46000, taxes: 61000 },
          { month: 'Mar', salaries: 155000, benefits: 47000, taxes: 62000 },
          { month: 'Abr', salaries: 160000, benefits: 48000, taxes: 64000 },
          { month: 'Mai', salaries: 162000, benefits: 48500, taxes: 65000 },
          { month: 'Jun', salaries: 165000, benefits: 50000, taxes: 66000 }
        ],
        discDistribution: [
          { name: 'D (Dominante)', value: 12, color: '#ef4444' },
          { name: 'I (Influente)', value: 15, color: '#eab308' },
          { name: 'S (Estável)', value: 10, color: '#22c55e' },
          { name: 'C (Conformista)', value: 5, color: '#3b82f6' }
        ]
      });
    }, 500);
  });
};

export function useHRDashboardData() {
  const [data, setData] = useState<HRDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const dashboardData = await fetchHRDashboardData();
      setData(dashboardData);
    } catch (err) {
      console.error('Error fetching HR dashboard data:', err);
      setError(err as Error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados do dashboard de RH.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, isLoading, error, refetch: fetchData };
}
