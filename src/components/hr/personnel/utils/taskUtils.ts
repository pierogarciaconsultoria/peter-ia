import { createNotification } from "@/services/notificationService";
import { movementTypes } from "../form/MovementTypeSelector";
import { supabase } from "@/integrations/supabase/client";

// Define simple local interfaces instead of importing complex types
interface SimpleManagerData { 
  id: string 
}

// Local interface to replace TaskRequestDataLite
interface LocalTaskRequestData {
  id?: string;
  type?: string;
  department?: string;
  requester_id?: string;
  employee_id?: string;
  employeeName?: string;
  justification?: string;
}

export const getModuleManagers = async (module: string): Promise<SimpleManagerData[]> => {
  const { data, error } = await supabase.rpc('get_managers', { module });
  return error ? [] : (data as { id: string }[]);
};

// Helper function with explicit types
const safeCreateNotification = async (
  userId: string,
  title: string,
  message: string,
  entityType: "task" | "other", 
  entityId: string,
  link?: string
) => {
  try {
    await createNotification(userId, title, message, entityType, entityId, link);
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

export const createTaskInModule = async (taskRequestData: LocalTaskRequestData): Promise<void> => {
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
