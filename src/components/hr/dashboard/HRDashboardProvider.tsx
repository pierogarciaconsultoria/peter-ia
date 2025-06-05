
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

// Unified HRMetrics interface with all required properties
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

// Complete default metrics with all required properties
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
  const { data, isLoading, error, refetch } = useHRDashboardData();

  // Transform metrics to match the complete interface
  const completeMetrics: HRMetrics = {
    ...defaultMetrics,
    // Use data from hook if available, otherwise use defaults
    totalEmployees: data?.metrics?.totalEmployees || 0,
    newHires: data?.metrics?.newHires || 0,
    upcomingEvaluations: data?.metrics?.upcomingEvaluations || 0,
    pendingTrainings: data?.metrics?.pendingTrainings || 0,
    departments: data?.metrics?.departments || 0,
    turnoverRate: data?.metrics?.turnoverRate || 0,
    averageTenure: data?.metrics?.averageTenure || 0,
    pendingRecruitments: data?.metrics?.pendingRecruitments || 0,
    vacationRequests: data?.metrics?.vacationRequests || 0,
    approvedPositions: data?.metrics?.approvedPositions || 0,
    filledPositions: data?.metrics?.filledPositions || 0,
    medicalLeaves: data?.metrics?.medicalLeaves || 0,
    activeJobs: data?.metrics?.activeJobs || 0,
    pendingApplications: data?.metrics?.pendingApplications || 0,
    scheduledInterviews: data?.metrics?.scheduledInterviews || 0,
    trialEvaluations: data?.metrics?.trialEvaluations || 0,
    onboardingProcesses: data?.metrics?.onboardingProcesses || 0,
    pendingOnboarding: data?.metrics?.pendingOnboarding || 0,
    pendingEvaluations: data?.metrics?.pendingEvaluations || 0,
    developmentPlans: data?.metrics?.developmentPlans || 0,
    employeeCount: data?.metrics?.employeeCount || data?.metrics?.totalEmployees || 0,
    newEmployees: data?.metrics?.newEmployees || data?.metrics?.newHires || 0,
    openPositions: data?.metrics?.openPositions || data?.metrics?.activeJobs || 0
  };

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
