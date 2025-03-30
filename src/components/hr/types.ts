
export interface JobPosition {
  id: string;
  code?: string;
  title: string;
  department?: string;
  description?: string;
  revision?: string;
  approval_date?: string;
  approver?: string;
  immediate_supervisor_position?: string;
  is_supervisor?: boolean;
  is_department_head?: boolean;
  superior_position_id?: string;
  cbo_code?: string;
  norm?: string;
  main_responsibilities?: string;
  education_requirements?: string;
  skill_requirements?: string;
  training_requirements?: string;
  experience_requirements?: string;
  required_procedures?: string[];
  required_resources?: string[];
  required_ppe?: string[];
  status?: "draft" | "in_review" | "approved" | "distributed";
}
