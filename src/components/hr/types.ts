
export interface JobPosition {
  id: string;
  title: string;
  department: string;
  description: string;
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
