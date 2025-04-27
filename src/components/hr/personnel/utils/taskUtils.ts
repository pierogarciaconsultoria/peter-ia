
import { PersonnelRequest } from "../types";
import { createNotification } from "@/services/notificationService";
import { movementTypes } from "../form/MovementTypeSelector";
import { supabase } from "@/integrations/supabase/client";
import { SimpleManagerData, TaskCreationData, CreatedTask } from "../types/taskTypes";

// Non-recursive interface for schedule types to break potential circular references
interface ReadonlySchedule {
  readonly start1: string;
  readonly end1: string;
  readonly start2: string;
  readonly end2: string;
}

// Interface explícita para evitar recursão de tipos
interface ReadonlyPersonnelRequest {
  readonly id: string;
  readonly type: string;
  readonly department: string;
  readonly position: string;
  readonly position_id: string;
  readonly requestDate: string;
  readonly status: string;
  readonly requester: string;
  readonly requester_id: string;
  readonly employeeName: string;
  readonly employee_id: string;
  readonly justification?: string;
  readonly currentSalary?: string;
  readonly proposedSalary?: string;
  readonly currentPosition?: string;
  readonly proposedPosition?: string;
  readonly approved_by?: string;
  readonly approval_date?: string;
  readonly rejection_reason?: string;
  readonly targetDate?: string;
  readonly currentSchedule?: ReadonlySchedule;
  readonly proposedSchedule?: ReadonlySchedule;
  readonly hr_observation?: string;
}

export const getModuleManagers = async (module: string): Promise<SimpleManagerData[]> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('role', 'manager')
      .eq('module', module);
      
    if (error) {
      console.error('Error fetching module managers:', error);
      return [];
    }
    
    return data?.map(manager => ({ id: manager.id })) ?? [];
  } catch (err) {
    console.error('Exception when fetching module managers:', err instanceof Error ? err.message : 'Unknown error');
    return [];
  }
};

// Using a type assertion to break any potential circular reference
export const createTaskInModule = async (request: ReadonlyPersonnelRequest): Promise<void> => {
  const movementType = movementTypes.find(type => type.id === request.type);
  if (!movementType) return;

  try {
    console.log(`Creating task in module: ${movementType.targetModule}`);
    
    const taskData: TaskCreationData = {
      title: `${movementType.label} - ${request.employeeName}`,
      description: request.justification || '',
      module: movementType.targetModule,
      status: 'pending',
      employee_id: request.employee_id,
      requester_id: request.requester_id,
      personnel_request_id: request.id
    };

    console.log(taskData);
    
    const simulatedTask: CreatedTask = {
      id: crypto.randomUUID(),
      title: taskData.title,
      status: 'pending'
    };

    const moduleManagers = await getModuleManagers(movementType.targetModule);
    
    await Promise.all(
      moduleManagers.map(manager => 
        createNotification(
          manager.id,
          `Nova tarefa de ${movementType.label}`,
          `Uma nova tarefa foi criada para ${request.employeeName || 'um colaborador'}`,
          "task",
          simulatedTask.id
        )
      )
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro ao criar tarefa:', error.message);
    }
    throw error;
  }
};
