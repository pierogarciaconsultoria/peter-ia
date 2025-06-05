
export interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  hire_date: string;
  status: 'active' | 'inactive' | 'pending_onboarding' | 'on_leave';
  company_id: string;
  phone?: string;
  salary?: number;
  avatar_url?: string;
  sector?: string;
  immediate_supervisor_id?: string;
  job_position_id?: string;
  department_id?: string;
  empresa_id?: string;
  created_at?: string;
  updated_at?: string;
}
