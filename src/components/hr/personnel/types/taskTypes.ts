
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

// Define a non-recursive base interface
export interface BaseTask {
  id: string;
  name: string;
}

// Define a task with no nesting
export interface Task extends BaseTask {
  subtasks?: unknown[]; // Using unknown[] prevents TypeScript from trying to resolve the type recursively
}

// Define explicitly how deep you want to allow nesting
export interface TaskLevel1 extends BaseTask {
  subtasks?: TaskLevel2[];
}

export interface TaskLevel2 extends BaseTask {
  subtasks?: TaskLevel3[];
}

export interface TaskLevel3 extends BaseTask {
  subtasks?: TaskLevel4[];
}

export interface TaskLevel4 extends BaseTask {
  subtasks?: never; // No further nesting allowed
}
