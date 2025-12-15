
import React, { createContext, useContext, ReactNode } from 'react';
import { useHRDashboardMetrics } from '@/hooks/useHRDashboardMetrics';

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
  const { metrics, isLoading, errors, refetch } = useHRDashboardMetrics();

  // Transform metrics to match the complete interface
  const completeMetrics: HRMetrics = {
    ...defaultMetrics,
    totalEmployees: metrics.employeeCount.value,
    newHires: metrics.newEmployees.value,
    upcomingEvaluations: metrics.upcomingEvaluations?.value || 0,
    pendingTrainings: metrics.pendingTrainings?.value || 0,
    departments: metrics.departments?.value || 0,
    turnoverRate: metrics.turnoverRate?.value || 0,
    averageTenure: metrics.averageTenure?.value || 0,
    pendingRecruitments: metrics.pendingRecruitments?.value || 0,
    vacationRequests: metrics.vacationRequests?.value || 0,
    approvedPositions: metrics.approvedPositions?.value || 0,
    filledPositions: metrics.filledPositions?.value || 0,
    medicalLeaves: metrics.medicalLeaves?.value || 0,
    activeJobs: metrics.openPositions.value, // Alias
    pendingApplications: metrics.pendingApplications?.value || 0,
    scheduledInterviews: metrics.scheduledInterviews?.value || 0,
    trialEvaluations: metrics.trialEvaluations?.value || metrics.pendingEvaluations.value,
    onboardingProcesses: metrics.onboardingProcesses?.value || metrics.pendingOnboarding.value,
    pendingOnboarding: metrics.pendingOnboarding.value,
    pendingEvaluations: metrics.pendingEvaluations.value,
    developmentPlans: metrics.developmentPlans.value,
    employeeCount: metrics.employeeCount.value,
    newEmployees: metrics.newEmployees.value,
    openPositions: metrics.openPositions.value
  };

  const dashboardData: HRDashboardData = {
    metrics: completeMetrics,
    departmentDistribution: [], // To be implemented or fetched separately if needed
    turnoverData: [],
    recruitmentStatus: [],
    trainingCompletionData: [],
    evaluationScores: [],
    salaryComparisonData: [],
    employeeCostsData: [],
    discDistribution: []
  };

  const value = {
    dashboardData,
    isLoading,
    error: errors.length > 0 ? new Error(errors[0]) : null,
    refreshData: refetch
  };

  return (
    <HRDashboardContext.Provider value={value}>
      {children}
    </HRDashboardContext.Provider>
  );
}
