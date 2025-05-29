
export type JobPosition = {
  id: string;
  title: string;
  department: string;
  description: string;
};

export type Employee = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  position_id?: string;
  position_details?: JobPosition;
  status: "active" | "inactive" | "on_leave";
  hire_date: string;
  avatar_url?: string;
  company_id?: string;
  created_at?: string;
  updated_at?: string;
  empresa_id?: string;
};
