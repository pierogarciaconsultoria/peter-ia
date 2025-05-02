
// Definições de tipos simplificados para uso em taskUtils
export type SimpleManagerData = { id: string };

export interface TaskRequestDataLite {
  id?: string;
  type?: string;
  department?: string;
  requester_id?: string;
  employee_id?: string;
  employeeName?: string;
  justification?: string;
}

export interface CreatedTask {
  id: string;
  title: string;
  // Apenas os campos essenciais para evitar tipos complexos
}

export type TaskCreationData = Omit<TaskRequestDataLite, 'justification'> & {
  status: string;
};
