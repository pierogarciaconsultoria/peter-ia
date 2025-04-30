
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

export const createTaskInModule = async (taskRequestData: TaskRequestDataLite): Promise<void> => {
  // Break the type inference chain with an explicitly typed independent variable
  const requestData: TaskRequestDataLite = {
    id: taskRequestData.id,
    type: taskRequestData.type,
    department: taskRequestData.department,
    requester_id: taskRequestData.requester_id,
    employee_id: taskRequestData.employee_id,
    employeeName: taskRequestData.employeeName,
    justification: taskRequestData.justification
  };
  
  const movementType = movementTypes.find(type => type.id === requestData.type);
  if (!movementType) return;

  try {
    console.log(`Creating task in module: ${movementType.targetModule}`);
    
    const taskData: TaskCreationData = {
      title: `${movementType.label} - ${requestData.employeeName}`,
      description: requestData.justification || '',
      module: movementType.targetModule,
      status: 'pending',
      employee_id: requestData.employee_id,
      requester_id: requestData.requester_id,
      personnel_request_id: requestData.id
    };

    console.log(taskData);
    
    const simulatedTask: CreatedTask = {
      id: crypto.randomUUID(),
      title: taskData.title,
      status: 'pending'
    };

    const moduleManagers = await getModuleManagers(movementType.targetModule);
    
    // Process notifications sequentially with fully defined types
    for (const manager of moduleManagers) {
      await createNotification(
        manager.id,
        `Nova tarefa de ${movementType.label}`,
        `Uma nova tarefa foi criada para ${requestData.employeeName || 'um colaborador'}`,
        "task",
        simulatedTask.id
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro ao criar tarefa:', error.message);
    }
    throw error;
  }
};
