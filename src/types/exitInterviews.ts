
export interface ExitInterview {
  id: string;
  employee_id: string;
  company_id: string;
  token: string;
  employee_name: string;
  employee_phone?: string;
  termination_date: string;
  termination_reason?: string;
  interview_date?: string;
  status: 'pending' | 'sent' | 'completed' | 'expired';
  
  // Campos da entrevista
  overall_satisfaction?: number;
  work_environment_rating?: number;
  management_rating?: number;
  growth_opportunities_rating?: number;
  compensation_rating?: number;
  
  what_liked_most?: string;
  what_liked_least?: string;
  suggestions_for_improvement?: string;
  reason_for_leaving?: string;
  would_recommend_company?: boolean;
  would_consider_returning?: boolean;
  additional_comments?: string;
  
  // Controle de envio
  whatsapp_sent_at?: string;
  whatsapp_message_id?: string;
  link_expires_at?: string;
  
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface CreateExitInterviewData {
  employee_id: string;
  company_id: string;
  employee_name: string;
  employee_phone?: string;
  termination_date: string;
  termination_reason?: string;
}

export interface ExitInterviewFormData {
  overall_satisfaction: number;
  work_environment_rating: number;
  management_rating: number;
  growth_opportunities_rating: number;
  compensation_rating: number;
  what_liked_most: string;
  what_liked_least: string;
  suggestions_for_improvement: string;
  reason_for_leaving: string;
  would_recommend_company: boolean;
  would_consider_returning: boolean;
  additional_comments: string;
}
