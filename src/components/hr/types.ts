export interface JobPosition {
  id: string;
  code?: string;
  title: string;
  description: string;
  department: string;
  revision?: string;
  approval_date?: string;
  approver?: string;
  is_supervisor?: boolean;
  is_department_head?: boolean;
  immediate_supervisor_position?: string;
  superior_position_id?: string;
  cbo_code?: string;
  norm?: string;
  status?: 'draft' | 'in_review' | 'approved' | 'distributed';
  
  // Level-specific responsibilities and requirements
  main_responsibilities?: string;
  responsibilities_junior?: string;
  responsibilities_mid?: string;
  responsibilities_senior?: string;
  
  // Education and competencies by level
  education_requirements?: string;
  skill_requirements?: string;
  skills_junior?: string;
  skills_mid?: string;
  skills_senior?: string;
  
  // Training requirements by level
  training_requirements?: string;
  training_junior?: string;
  training_mid?: string;
  training_senior?: string;
  
  // External training requirements by level
  external_training?: string;
  external_training_junior?: string;
  external_training_mid?: string;
  external_training_senior?: string;
  
  // Experience requirements
  experience_requirements?: string;
  
  // Salary ranges by level
  salary_junior?: string;
  salary_mid?: string;
  salary_senior?: string;
  
  // Other existing fields
  required_procedures?: string[];
  required_resources?: string[];
  required_ppe?: string[];

  // These are the original fields that might be coming from the database
  // We'll keep them for backward compatibility
  requirements?: string;
  responsibilities?: string;
  company_id?: string;
  created_at?: string;
  updated_at?: string;
}
