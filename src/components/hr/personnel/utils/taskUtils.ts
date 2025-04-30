
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
  // Create a completely separate object to break type inference chains
  const requestId = taskRequestData.id;
  const requestType = taskRequestData.type;
  const requestDepartment = taskRequestData.department;
  const requesterId = taskRequestData.requester_id;
  const employeeId = taskRequestData.employee_id;
  const employeeName = taskRequestData.employeeName;
  const requestJustification = taskRequestData.justification;
  
  const movementType = movementTypes.find(type => type.id === requestType);
  if (!movementType) return;

  try {
    console.log(`Creating task in module: ${movementType.targetModule}`);
    
    const taskData: TaskCreationData = {
      title: `${movementType.label} - ${employeeName}`,
      description: requestJustification || '',
      module: movementType.targetModule,
      status: 'pending',
      employee_id: employeeId,
      requester_id: requesterId,
      personnel_request_id: requestId
    };

    console.log(taskData);
    
    // Create task ID upfront to avoid nested references
    const taskId = crypto.randomUUID();
    const taskTitle = taskData.title;
    
    const simulatedTask: CreatedTask = {
      id: taskId,
      title: taskTitle,
      status: 'pending'
    };

    const moduleManagers = await getModuleManagers(movementType.targetModule);
    
    // Process each notification individually to avoid map/lambda issues
    for (const manager of moduleManagers) {
      const managerId = manager.id;
      const notificationTitle = `Nova tarefa de ${movementType.label}`;
      const notificationMessage = `Uma nova tarefa foi criada para ${employeeName || 'um colaborador'}`;
      
      await createNotification(
        managerId,
        notificationTitle,
        notificationMessage,
        "task",
        taskId
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro ao criar tarefa:', error.message);
    }
    throw error;
  }
};
