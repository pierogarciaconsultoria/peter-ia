
export interface JobPosition {
  id: string;
  title: string;
  department: string;
  description: string;
  code: string;
  revision: string;
  approval_date?: string;
  approver?: string;
  immediate_supervisor_position?: string;
  is_supervisor?: boolean;
  cbo_code?: string;
  norm?: string;
  main_responsibilities?: string;
  education_requirements?: string;
  skill_requirements?: string;
  training_requirements?: string;
  experience_requirements?: string;
  required_procedures?: string[];
  required_resources?: string[];
  required_ppe?: string[]; // Personal Protective Equipment
  status?: "draft" | "approved" | "in_review" | "distributed";
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  position_id?: string;
  position_details?: JobPosition;
  status: "active" | "inactive" | "on_leave";
  hireDate: string;
  avatar?: string;
}
