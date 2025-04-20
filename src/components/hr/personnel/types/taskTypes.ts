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

export interface Task {
  id: string;
  name: string;
  subtasks?: unknown[]; // Use unknown[] instead of Task[]
}

// Alternatively, if you want to keep some type safety:
export interface TaskWithSubtasks extends Task {
  subtasks: Task[]; // This allows explicit nesting while preventing recursive inference
}
