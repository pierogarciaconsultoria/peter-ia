
import { createNotification } from "@/services/notificationService";
import { movementTypes } from "../form/MovementTypeSelector";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Task, TaskManager } from "@/types/tasks";
import { getModuleManagers } from "./managerUtils";
import { safeCreateNotification } from "./notificationUtils";

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

/**
 * Creates a task in the appropriate module based on the request type
 */
export const createTaskInModule = async (taskRequestData: LocalTaskRequestData): Promise<void> => {
  // Validate input data
  if (!taskRequestData || typeof taskRequestData !== 'object') {
    console.error('Invalid task request data');
    toast.error("Cannot create task: Invalid request data");
    return;
  }

  // Extracting primitive values immediately to avoid deep type inference
  const requestId = String(taskRequestData.id || '');
  const requestType = String(taskRequestData.type || '');
  const requestDepartment = String(taskRequestData.department || '');
  const requesterId = String(taskRequestData.requester_id || '');
  const employeeId = String(taskRequestData.employee_id || '');
  const employeeName = String(taskRequestData.employeeName || '');
  const requestJustification = String(taskRequestData.justification || '');
  
  // Finding target module using primitive string comparison
  let targetModule = '';
  let movementLabel = '';
  
  for (const currentType of movementTypes) {
    if (currentType.id === requestType) {
      targetModule = currentType.targetModule;
      movementLabel = currentType.label;
      break;
    }
  }
  
  if (!targetModule) {
    console.warn('Target module not found for type:', requestType);
    toast.error(`Cannot create task: Unknown request type "${requestType}"`);
    return;
  }

  try {
    console.log(`Creating task in module: ${targetModule} for movement type: ${movementLabel}`);
    
    const taskTitle = `${movementLabel} - ${employeeName || 'Employee'}`;
    const taskDescription = requestJustification || 'No justification provided';
    const taskStatus = 'pending';
    
    // Creating task ID in advance for consistent references
    const taskId = crypto.randomUUID();
    
    // Log structured task data for debugging
    const taskData: Task = {
      id: taskId,
      title: taskTitle,
      description: taskDescription,
      module: targetModule,
      status: taskStatus,
      employee_id: employeeId,
      requester_id: requesterId,
      personnel_request_id: requestId
    };
    
    console.log('Creating task with data:', taskData);
    
    // Use type assertion to tell TypeScript that this table exists
    const { error: taskError } = await (supabase
      .from('tasks' as any)
      .insert(taskData as any));
      
    if (taskError) {
      console.error('Error creating task:', taskError);
      toast.error("Failed to create task in database");
      return;
    }
    
    // Get managers for the target module
    const managers = await getModuleManagers(targetModule);
    
    if (managers.length === 0) {
      console.warn(`No managers found for module: ${targetModule}`);
      toast.warning(`Task created but no module managers found to notify for ${targetModule}`);
    }
    
    // Process notifications for all managers with explicit typing
    await notifyManagers(managers, movementLabel, employeeName, taskId);
    
    toast.success("Task created and notifications sent successfully");
  } catch (error) {
    console.error('Error creating task:', error instanceof Error ? error.message : String(error));
    toast.error("Failed to create task: Unexpected error");
  }
};

/**
 * Send notifications to all managers about a new task
 */
async function notifyManagers(
  managers: TaskManager[], 
  movementLabel: string, 
  employeeName: string, 
  taskId: string
): Promise<void> {
  for (const manager of managers) {
    if (!manager || typeof manager.id !== 'string' || !manager.id) {
      console.warn('Invalid manager data:', manager);
      continue;
    }
    
    const managerId = manager.id;
    
    const notificationTitle = `New ${movementLabel} task`;
    const notificationMessage = `A new task has been created for ${employeeName || 'an employee'}`;
    const notificationLink = `/tasks/${taskId}`;
    
    // Use safeCreateNotification instead of direct createNotification
    await safeCreateNotification(
      managerId,
      notificationTitle,
      notificationMessage,
      "task",
      taskId,
      notificationLink
    );
  }
}
