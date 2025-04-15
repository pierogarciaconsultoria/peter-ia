
export interface CandidateAssessment {
  id: string;
  company_id: string;
  title: string;
  description?: string;
  active: boolean;
  questions: AssessmentQuestion[];
  created_at?: string;
  updated_at?: string;
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  type: 'multiple_choice' | 'text' | 'scale' | 'boolean';
  options?: string[];
  required?: boolean;
}

export interface AssessmentLink {
  id: string;
  assessment_id: string;
  candidate_name: string;
  candidate_email: string;
  recruitment_process_id?: string;
  token: string;
  expires_at: string;
  used: boolean;
  created_at: string;
}

export interface AssessmentResponse {
  id: string;
  assessment_id: string;
  link_id: string;
  candidate_name: string;
  candidate_email: string;
  answers: Record<string, any>;
  score?: number;
  submitted_at: string;
}
