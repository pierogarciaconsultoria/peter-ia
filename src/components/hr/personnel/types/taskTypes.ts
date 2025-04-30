
// Status possíveis para tarefas
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

// Dados básicos de gestor - sem referências circulares
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

// Interface simplificada de solicitação para quebrar dependências circulares
export interface TaskRequestDataLite {
  id: string;
  type: string;
  department: string;
  requester_id: string;
  employee_id: string;
  employeeName: string;
  justification?: string;
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

// Estrutura básica de tarefa - sem referências circulares
export interface Task {
  id: string;
  name: string;
  subtasks?: SimpleSubtask[];
}

// Estrutura simplificada de subtarefa - sem referências circulares
export interface SimpleSubtask {
  id: string;
  name: string;
}
