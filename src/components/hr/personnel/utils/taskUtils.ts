
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
    // Use an explicit type for the query result
    type UserProfileRow = { id: string };
    
    // Perform the query with explicit type casting
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('role', 'manager')
      .eq('module', module);
      
    if (error) {
      console.error('Error fetching module managers:', error);
      return [];
    }
    
    if (!data || !Array.isArray(data)) {
      return [];
    }
    
    // Use a simple map operation with type safety
    return data
      .filter((item): item is UserProfileRow => 
        item !== null && typeof item === 'object' && typeof item.id === 'string')
      .map(manager => ({ id: manager.id }));
      
  } catch (err) {
    console.error('Exception when fetching module managers:', err instanceof Error ? err.message : 'Unknown error');
    return [];
  }
};

export const createTaskInModule = async (taskRequestData: TaskRequestDataLite): Promise<void> => {
  // Extract all primitive values immediately to avoid deep type inference
  const requestId = String(taskRequestData.id || '');
  const requestType = String(taskRequestData.type || '');
  const requestDepartment = String(taskRequestData.department || '');
  const requesterId = String(taskRequestData.requester_id || '');
  const employeeId = String(taskRequestData.employee_id || '');
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
    
    // Get managers with simple type handling
    const managers = await getModuleManagers(targetModule).catch(err => {
      console.error('Error fetching managers:', err);
      return [] as SimpleManagerData[];
    });
    
    // Process notifications
    for (const manager of managers) {
      if (!manager || typeof manager.id !== 'string') continue;
      
      const managerId = manager.id;
      
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
    console.error('Erro ao criar tarefa:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};
