
import { createNotification } from "@/services/notificationService";
import { movementTypes } from "../form/MovementTypeSelector";
import { supabase } from "@/integrations/supabase/client";
import { 
  SimpleManagerData, 
  TaskCreationData, 
  CreatedTask,
  TaskRequestDataLite
} from "../types/taskTypes";

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

// Simplified notification helper with explicit return type
const notifyManager = (
  managerId: string,
  title: string,
  message: string,
  type: string, 
  referenceId: string
) => {
  return createNotification(
    managerId,
    title,
    message,
    type,
    referenceId
  );
};

// Main function with explicit typing
export const createTaskInModule = async (taskRequestData: TaskRequestDataLite): Promise<void> => {
  // Create explicitly typed copy to break inference chain
  const request: TaskRequestDataLite = {
    id: taskRequestData.id,
    type: taskRequestData.type,
    department: taskRequestData.department,
    requester_id: taskRequestData.requester_id,
    employee_id: taskRequestData.employee_id,
    employeeName: taskRequestData.employeeName,
    justification: taskRequestData.justification
  };
  
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
    
    // Using the suggested approach with a simplified notifyManager function
    const notifyManager = (managerId: string) => {
      return createNotification(
        managerId,
        `Nova tarefa de ${movementType.label}`,
        `Uma nova tarefa foi criada para ${request.employeeName || 'um colaborador'}`,
        "task",
        simulatedTask.id
      );
    };

    // Using Promise.all with a simpler function reference
    await Promise.all(moduleManagers.map(manager => notifyManager(manager.id)));
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro ao criar tarefa:', error.message);
    }
    throw error;
  }
};
