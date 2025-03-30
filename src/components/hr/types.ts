
// JobPosition type
export interface JobPosition {
  id: string;
  title: string;
  description?: string;
  code?: string;
  department?: string;
  revision?: string;
  is_supervisor?: boolean;
  status?: string;
  requirements?: string;
  responsibilities?: string;
  required_procedures?: string[];
  
  // New fields that are being used in the components
  approval_date?: string;
  approver?: string;
  immediate_supervisor_position?: string;
  cbo_code?: string;
  norm?: string;
  main_responsibilities?: string;
  education_requirements?: string;
  skill_requirements?: string;
  training_requirements?: string;
  experience_requirements?: string;
  required_resources?: string[];
  required_ppe?: string[];
}
