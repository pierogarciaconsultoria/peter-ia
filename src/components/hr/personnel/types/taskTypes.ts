
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

export interface SimpleManagerData {
  id: string;
}

export interface TaskCreationData {
  title: string;
  description: string;
  module: string;
  status: TaskStatus;
  employee_id: string;
  requester_id: string;
  personnel_request_id: string;
}

export interface CreatedTask {
  id: string;
  title: string;
  status: TaskStatus;
}

// Break the recursive nesting by using simplified subtask representation
export interface Task {
  id: string;
  name: string;
  subtasks?: SimpleSubtask[]; // Using non-recursive type
}

// Simple, non-recursive type for subtasks
export interface SimpleSubtask {
  id: string;
  name: string;
}
