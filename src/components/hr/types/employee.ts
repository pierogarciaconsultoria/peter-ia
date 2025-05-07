
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
  department: string;
  position: string;
  position_id?: string; // Reference to job_positions table
  position_details?: JobPosition;
  status: "active" | "inactive" | "on_leave";
  hire_date: string;
  avatar_url?: string;
};
