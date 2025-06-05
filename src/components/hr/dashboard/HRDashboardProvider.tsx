
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

// Default data for when the real data is loading
const defaultData: HRDashboardData = {
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
    approvedPositions: 0,
    filledPositions: 0,
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
  // Use our real data fetching hook
  const { data, isLoading, error, refetch } = useHRDashboardData();

  const value = {
    dashboardData: data || defaultData,
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
