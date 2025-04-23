
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

// Base manager data type
export interface SimpleManagerData {
  id: string;
}

// Flattened task creation data
export interface TaskCreationData {
  title: string;
  description: string;
  module: string;
  status: TaskStatus;
  employee_id: string;
  requester_id: string;
  personnel_request_id: string;
}

// Simple task response type
export interface CreatedTask {
  id: string;
  title: string;
  status: TaskStatus;
}

// Base task interface
export interface Task {
  id: string;
  name: string;
  subtasks?: SimpleSubtask[];
}

// Simple subtask interface
export interface SimpleSubtask {
  id: string;
  name: string;
}
