
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
    // Define an explicit interface for the database result
    interface UserProfileResult {
      id: string;
    }
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('role', 'manager')
      .eq('module', module);
      
    if (error) {
      console.error('Error fetching module managers:', error);
      return [];
    }
    
    // Explicitly type the result and transform it
    const typedData = data as UserProfileResult[] | null;
    return typedData ? typedData.map(manager => ({ id: manager.id })) : [];
  } catch (err) {
    console.error('Exception when fetching module managers:', err instanceof Error ? err.message : 'Unknown error');
    return [];
  }
};

export const createTaskInModule = async (taskRequestData: TaskRequestDataLite): Promise<void> => {
  // Extract primitive values immediately to avoid deep type inference
  const requestId = String(taskRequestData.id);
  const requestType = String(taskRequestData.type);
  const requestDepartment = String(taskRequestData.department);
  const requesterId = String(taskRequestData.requester_id);
  const employeeId = String(taskRequestData.employee_id);
  const employeeName = String(taskRequestData.employeeName || '');
  const requestJustification = String(taskRequestData.justification || '');
  
  // Find movement type using primitive string comparison
  let targetModule = '';
  let movementLabel = '';
  
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
    
    const taskTitle = `${movementLabel} - ${employeeName}`;
    const taskDescription = requestJustification;
    const taskStatus = 'pending';
    
    // Create task ID in advance to avoid nested references
    const taskId = crypto.randomUUID();
    
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
    
    // Fetch managers with explicit type for result
    let managers: SimpleManagerData[] = [];
    try {
      managers = await getModuleManagers(targetModule);
    } catch (err) {
      console.error('Error fetching managers:', err);
      managers = [];
    }
    
    // Process each notification individually with explicit string types
    for (let j = 0; j < managers.length; j++) {
      // Safety check and explicit type
      if (!managers[j] || !managers[j].id) continue;
      
      const managerId = String(managers[j].id);
      if (!managerId) continue;
      
      const notificationTitle = `Nova tarefa de ${movementLabel}`;
      const notificationMessage = `Uma nova tarefa foi criada para ${employeeName || 'um colaborador'}`;
      const entityType = "task";
      
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
