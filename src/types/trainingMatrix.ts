
export interface JobPositionTrainingRequirement {
  id: string;
  job_position_id: string;
  training_id?: string;
  procedure_id?: string;
  is_mandatory: boolean;
  completion_deadline_days: number;
  created_at: string;
  updated_at: string;
  company_id: string;
  created_by?: string;
  // Relations
  job_position?: {
    id: string;
    title: string;
    department_id: string;
    department?: {
      name: string;
    };
  };
  training?: {
    id: string;
    title: string;
    description?: string;
  };
  procedure?: {
    id: string;
    title: string;
    document_type: string;
  };
}

export interface EmployeeTrainingCompliance {
  id: string;
  employee_id: string;
  requirement_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue' | 'exempt';
  assigned_date: string;
  due_date?: string;
  completion_date?: string;
  score?: number;
  certificate_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  company_id: string;
  // Relations
  employee?: {
    id: string;
    name: string;
    position: string;
    department: string;
  };
  requirement?: JobPositionTrainingRequirement;
}

export interface TrainingMatrixData {
  jobPosition: {
    id: string;
    title: string;
    department: string;
  };
  requirements: JobPositionTrainingRequirement[];
  compliance: EmployeeTrainingCompliance[];
}

export interface TrainingMatrixFilters {
  department?: string;
  jobPosition?: string;
  employee?: string;
  status?: string;
  isOverdue?: boolean;
}

export interface ComplianceStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  overdue: number;
  completionRate: number;
}
