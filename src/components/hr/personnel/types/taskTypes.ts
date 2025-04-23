
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

// Using flat type definitions without circular references
export interface Task {
  id: string;
  name: string;
  subtasks?: SimpleSubtask[];
}

// Simple subtask type definition
export interface SimpleSubtask {
  id: string;
  name: string;
}
