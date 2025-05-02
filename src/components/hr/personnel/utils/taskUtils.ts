
import { createNotification } from "@/services/notificationService";
import { movementTypes } from "../form/MovementTypeSelector";
import { supabase } from "@/integrations/supabase/client";

// Define types locally to avoid deep type instantiation issues
type SimpleManagerData = { id: string }; // Simplified version

interface TaskRequestDataLite {
  id?: string;
  type?: string;
  department?: string;
  requester_id?: string;
  employee_id?: string;
  employeeName?: string;
  justification?: string;
}

interface CreatedTask {
  id: string;
  title: string;
  // Only essential fields
}

type TaskCreationData = Omit<TaskRequestDataLite, 'justification'> & {
  status: string;
};

export const getModuleManagers = async (module: string): Promise<SimpleManagerData[]> => {
  try {
    // Using a simpler approach that avoids complex typing
    const result = await supabase
      .from('user_profiles')
      .select('id')
      .eq('role', 'manager')
      .eq('module', module);
      
    // Use a direct type assertion without deep inference
    const data = result.data as SimpleManagerData[] || [];
    const error = result.error;
      
    if (error) {
      console.error('Error fetching module managers:', error);
      return [];
    }
    
    return data;
  } catch (err) {
    console.error('Exception when fetching module managers:', err instanceof Error ? err.message : 'Unknown error');
    return [];
  }
};

// More typed function for createNotification
const safeCreateNotification = async (
  userId: string,
  title: string,
  message: string,
  entityType: "task" | "other", // Explicit types
  entityId: string,
  link?: string
) => {
  try {
    await createNotification(userId, title, message, entityType, entityId, link);
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

export const createTaskInModule = async (taskRequestData: TaskRequestDataLite): Promise<void> => {
  // Extracting primitive values immediately to avoid deep type inference
  const requestId = String(taskRequestData.id || '');
  const requestType = String(taskRequestData.type || '');
  const requestDepartment = String(taskRequestData.department || '');
  const requesterId = String(taskRequestData.requester_id || '');
  const employeeId = String(taskRequestData.employee_id || '');
  const employeeName = String(taskRequestData.employeeName || '');
  const requestJustification = String(taskRequestData.justification || '');
  
  // Finding movement type using primitive string comparison
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
    
    // Creating task ID in advance to avoid nested references
    const taskId = crypto.randomUUID();
    
    // Logging task data without complex object
    console.log({
      title: taskTitle,
      description: taskDescription,
      module: targetModule,
      status: taskStatus,
      employee_id: employeeId,
      requester_id: requesterId,
      personnel_request_id: requestId
    });
    
    // Getting managers using our fixed function
    const managers = await getModuleManagers(targetModule);
    
    // Processing notifications with explicit typing
    for (const manager of managers) {
      if (!manager || typeof manager.id !== 'string') continue;
      
      const managerId = manager.id;
      
      const notificationTitle = `Nova tarefa de ${movementLabel}`;
      const notificationMessage = `Uma nova tarefa foi criada para ${employeeName || 'um colaborador'}`;
      
      try {
        // Using safeCreateNotification instead of direct createNotification
        await safeCreateNotification(
          managerId,
          notificationTitle,
          notificationMessage,
          "task",  // explicit type
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
