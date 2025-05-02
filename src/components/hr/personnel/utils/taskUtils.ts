
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
    // Using any to break deep type inference
    const result = await supabase
      .from('user_profiles')
      .select('id')
      .eq('role', 'manager')
      .eq('module', module);
      
    const { data, error } = result as unknown as { data: any[], error: any };
      
    if (error) {
      console.error('Error fetching module managers:', error);
      return [];
    }
    
    // Creating explicitly typed array
    const managers: SimpleManagerData[] = [];
    
    // Using basic loop to avoid complex type inference
    if (data && Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (item && typeof item.id === 'string') {
          managers.push({ id: item.id });
        }
      }
    }
    
    return managers;
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
  entityId: string
) => {
  await createNotification(userId, title, message, entityType, entityId);
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
    const managers = await getModuleManagers(targetModule).catch(err => {
      console.error('Error fetching managers:', err);
      return [] as SimpleManagerData[];
    });
    
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
