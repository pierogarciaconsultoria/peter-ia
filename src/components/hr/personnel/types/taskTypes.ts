
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

// Versão corrigida de Task:
export interface Task {
  id: string;
  name: string;
  subtasks?: SimpleSubtask[]; // Limita a profundidade e evita recursão infinita
}

export interface SimpleSubtask {
  id: string;
  name: string;
}
