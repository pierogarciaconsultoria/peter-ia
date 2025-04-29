
// Status possíveis para tarefas
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

// Dados básicos de gestor
export interface SimpleManagerData {
  id: string;
}

// Estrutura de horário para uso em solicitações
export interface ScheduleData {
  start1: string;
  end1: string;
  start2: string;
  end2: string;
}

// Interface de solicitação para uso em criação de tarefas
export interface TaskRequestData {
  id: string;
  type: string;
  department: string;
  position: string;
  position_id: string;
  requestDate: string;
  status: string;
  requester: string;
  requester_id: string;
  employeeName: string;
  employee_id: string;
  justification?: string;
  currentSalary?: string;
  proposedSalary?: string;
  currentPosition?: string;
  proposedPosition?: string;
  approved_by?: string;
  approval_date?: string;
  rejection_reason?: string;
  targetDate?: string;
  currentSchedule?: ScheduleData;
  proposedSchedule?: ScheduleData;
  hr_observation?: string;
}

// Dados para criação de tarefas (versão simplificada)
export interface TaskCreationData {
  title: string;
  description: string;
  module: string;
  status: TaskStatus;
  employee_id: string;
  requester_id: string;
  personnel_request_id: string;
}

// Resposta simplificada de tarefa criada
export interface CreatedTask {
  id: string;
  title: string;
  status: TaskStatus;
}

// Estrutura básica de tarefa
export interface Task {
  id: string;
  name: string;
  subtasks?: SimpleSubtask[];
}

// Estrutura simplificada de subtarefa
export interface SimpleSubtask {
  id: string;
  name: string;
}
