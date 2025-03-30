
// Types for job positions
export interface JobPosition {
  id: string;
  title: string;
  department: string;
  description: string;
  code?: string;
  skill_requirements?: string;
}

// Types for onboarding process
export interface OnboardingProcess {
  id: string;
  employeeName: string;
  position: string;
  position_id?: string;
  position_details?: JobPosition;
  startDate: string;
  progress: number;
  status: string;
  department: string;
}
