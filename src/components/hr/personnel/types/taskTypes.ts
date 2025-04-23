
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

// Using non-recursive type definitions to avoid circular references
export interface Task {
  id: string;
  name: string;
  subtasks?: SimpleSubtask[];
}

// Simple type for subtasks without recursive nesting
export interface SimpleSubtask {
  id: string;
  name: string;
}
