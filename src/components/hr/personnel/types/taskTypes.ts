
export interface TaskCreationData {
  title: string;
  description: string;
  module: string;
  status: string;
  employee_id: string;
  requester_id: string;
  personnel_request_id: string;
}

export interface CreatedTask {
  id: string;
  title: string;
  status: string;
}

export interface SimpleManagerData {
  id: string;
}
