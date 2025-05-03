
export interface Task {
  id: string;
  title: string;
  description?: string;
  module?: string;
  status: string;
  employee_id?: string;
  requester_id?: string;
  personnel_request_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TaskManager {
  id: string;
  name?: string;
  email?: string;
  allowed_modules?: string[];
}
