
import React, { createContext, useContext, ReactNode } from 'react';
import { useHRDashboardData } from '@/hooks/useHRDashboardData';

export interface DepartmentDistribution {
  name: string;
  value: number;
}

export interface TurnoverData {
  month: string;
  value: number;
}

export interface RecruitmentStatus {
  name: string;
  value: number;
}

export interface EvaluationScore {
  name: string;
  value: number;
}

export interface DiscDistribution {
  name: string;
  value: number;
  color: string;
}

export interface TrainingCompletionData {
  name: string;
  value: number;
}

export interface SalaryComparisonData {
  position: string;
  Empresa: number;
  Mercado: number;
}

export interface EmployeeCostsData {
  month: string;
  salaries: number;
  benefits: number;
  taxes: number;
}

// Updated HRMetrics interface to match all requirements
export interface HRMetrics {
  totalEmployees: number;
  newHires: number;
  upcomingEvaluations: number;
  pendingTrainings: number;
  departments: number;
  turnoverRate: number;
  averageTenure: number;
  pendingRecruitments: number;
  vacationRequests: number;
  approvedPositions: number;
  filledPositions: number;
  medicalLeaves: number;
  activeJobs: number;
  pendingApplications: number;
  scheduledInterviews: number;
  trialEvaluations: number;
  onboardingProcesses: number;
  pendingOnboarding: number;
  pendingEvaluations: number;
  developmentPlans: number;
  employeeCount: number;
  newEmployees: number;
  openPositions: number;
}

export interface HRDashboardData {
  metrics: HRMetrics;
  departmentDistribution: DepartmentDistribution[];
  turnoverData: TurnoverData[];
  recruitmentStatus: RecruitmentStatus[];
  trainingCompletionData: TrainingCompletionData[];
  evaluationScores: EvaluationScore[];
  salaryComparisonData: SalaryComparisonData[];
  employeeCostsData: EmployeeCostsData[];
  discDistribution: DiscDistribution[];
}

interface HRDashboardContextType {
  dashboardData: HRDashboardData;
  isLoading: boolean;
  error: Error | null;
  refreshData: () => void;
}

// Default data para quando os dados reais estão carregando
const defaultMetrics: HRMetrics = {
  totalEmployees: 0,
  newHires: 0,
  upcomingEvaluations: 0,
  pendingTrainings: 0,
  departments: 0,
  turnoverRate: 0,
  averageTenure: 0,
  pendingRecruitments: 0,
  vacationRequests: 0,
  approvedPositions: 0,
  filledPositions: 0,
  medicalLeaves: 0,
  activeJobs: 0,
  pendingApplications: 0,
  scheduledInterviews: 0,
  trialEvaluations: 0,
  onboardingProcesses: 0,
  pendingOnboarding: 0,
  pendingEvaluations: 0,
  developmentPlans: 0,
  employeeCount: 0,
  newEmployees: 0,
  openPositions: 0
};

const defaultData: HRDashboardData = {
  metrics: defaultMetrics,
  departmentDistribution: [],
  turnoverData: [],
  recruitmentStatus: [],
  trainingCompletionData: [],
  evaluationScores: [],
  salaryComparisonData: [],
  employeeCostsData: [],
  discDistribution: []
};

const HRDashboardContext = createContext<HRDashboardContextType | undefined>(undefined);

export function useHRDashboard() {
  const context = useContext(HRDashboardContext);
  if (context === undefined) {
    throw new Error('useHRDashboard must be used within a HRDashboardProvider');
  }
  return context;
}

interface HRDashboardProviderProps {
  children: ReactNode;
}

export function HRDashboardProvider({ children }: HRDashboardProviderProps) {
  // Usar nosso hook real de busca de dados
  const { data, isLoading, error, refetch } = useHRDashboardData();

  // Transform metrics to match the complete interface
  const completeMetrics: HRMetrics = {
    ...defaultMetrics,
    ...data?.metrics,
    // Map fields that might have different names
    employeeCount: data?.metrics?.totalEmployees || 0,
    newEmployees: data?.metrics?.newHires || 0,
    openPositions: data?.metrics?.activeJobs || 0,
    pendingOnboarding: data?.metrics?.onboardingProcesses || 0,
    pendingEvaluations: data?.metrics?.trialEvaluations || 0,
    developmentPlans: data?.metrics?.developmentPlans || 0
  };

  // Transformar os dados do hook para o formato esperado
  const dashboardData: HRDashboardData = {
    metrics: completeMetrics,
    departmentDistribution: data?.data?.departmentDistribution || [],
    turnoverData: data?.data?.turnoverData || [],
    recruitmentStatus: data?.data?.recruitmentStatus || [],
    trainingCompletionData: data?.data?.trainingCompletionData || [],
    evaluationScores: data?.data?.evaluationScores || [],
    salaryComparisonData: data?.data?.salaryComparisonData || [],
    employeeCostsData: data?.data?.employeeCostsData || [],
    discDistribution: data?.data?.discDistribution || []
  };

  const value = {
    dashboardData,
    isLoading,
    error: error ? new Error(error) : null,
    refreshData: refetch
  };

  return (
    <HRDashboardContext.Provider value={value}>
      {children}
    </HRDashboardContext.Provider>
  );
}
