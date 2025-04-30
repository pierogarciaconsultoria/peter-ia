
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
    // Use explicit return type with .returns<T>() to avoid deep type inference
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('role', 'manager')
      .eq('module', module)
      .returns<{ id: string }[]>();
      
    if (error) {
      console.error('Error fetching module managers:', error);
      return [];
    }
    
    // Map to the SimpleManagerData type explicitly
    return data?.map(manager => ({ id: manager.id })) ?? [];
  } catch (err) {
    console.error('Exception when fetching module managers:', err instanceof Error ? err.message : 'Unknown error');
    return [];
  }
};

export const createTaskInModule = async (taskRequestData: TaskRequestDataLite): Promise<void> => {
  // Extract primitive values immediately to avoid deep type inference
  const requestId: string = String(taskRequestData.id);
  const requestType: string = String(taskRequestData.type);
  const requestDepartment: string = String(taskRequestData.department);
  const requesterId: string = String(taskRequestData.requester_id);
  const employeeId: string = String(taskRequestData.employee_id);
  const employeeName: string = String(taskRequestData.employeeName || '');
  const requestJustification: string = String(taskRequestData.justification || '');
  
  // Find movement type using primitive string comparison
  let targetModule: string = '';
  let movementLabel: string = '';
  
  for (let i = 0; i < movementTypes.length; i++) {
    const currentType = movementTypes[i];
    if (currentType.id === requestType) {
      targetModule = currentType.targetModule;
      movementLabel = currentType.label;
      break;
    }
  }
  
  if (!targetModule) return;

  try {
    console.log(`Creating task in module: ${targetModule}`);
    
    const taskTitle: string = `${movementLabel} - ${employeeName}`;
    const taskDescription: string = requestJustification;
    const taskStatus: string = 'pending';
    
    // Create task ID upfront to avoid nested references
    const taskId: string = crypto.randomUUID();
    
    // Log task data without complex object
    console.log({
      title: taskTitle,
      description: taskDescription,
      module: targetModule,
      status: taskStatus,
      employee_id: employeeId,
      requester_id: requesterId,
      personnel_request_id: requestId
    });
    
    let managers: SimpleManagerData[] = [];
    try {
      managers = await getModuleManagers(targetModule);
    } catch (err) {
      console.error('Error fetching managers:', err);
      managers = [];
    }
    
    // Process each notification individually with explicit string types
    for (let j = 0; j < managers.length; j++) {
      const managerId: string = String(managers[j]?.id || '');
      if (!managerId) continue;
      
      const notificationTitle: string = `Nova tarefa de ${movementLabel}`;
      const notificationMessage: string = `Uma nova tarefa foi criada para ${employeeName || 'um colaborador'}`;
      const entityType: string = "task";
      
      try {
        await createNotification(
          managerId,
          notificationTitle,
          notificationMessage,
          entityType,
          taskId
        );
      } catch (notifError) {
        console.error('Error sending notification:', notifError);
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro ao criar tarefa:', error.message);
    }
    throw error;
  }
};
