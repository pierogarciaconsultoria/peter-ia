
import { createNotification } from "@/services/notificationService";
import { movementTypes } from "../form/MovementTypeSelector";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
 * Gets all managers for a specific module
 */
export const getModuleManagers = async (module: string): Promise<SimpleManagerData[]> => {
  try {
    // Validar o parâmetro de entrada
    if (!module || typeof module !== 'string') {
      console.warn('Invalid module provided to getModuleManagers:', module);
      return [];
    }
    
    // Query the database directly
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('role', 'manager')
      .contains('allowed_modules', [module]); // Using contains operator for array check
    
    if (error) {
      console.error('Error fetching module managers:', error.message);
      return [];
    }
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.warn('No manager data found for module:', module);
      return [];
    }
    
    // Safely transform data with proper type checking
    return data
      .filter(item => item && typeof item === 'object' && 'id' in item && item.id && typeof item.id === 'string')
      .map(item => ({ id: String(item.id) }));
  } catch (err) {
    console.error('Exception when fetching module managers:', err instanceof Error ? err.message : 'Unknown error');
    return [];
  }
};

/**
 * Helper function with explicit types to safely create notifications
 */
const safeCreateNotification = async (
  userId: string,
  title: string,
  message: string,
  entityType: "task" | "other", 
  entityId: string,
  link?: string
): Promise<void> => {
  try {
    // Extra validation of user ID
    if (!userId || typeof userId !== 'string' || userId.length < 10) {
      console.warn('Invalid user ID for notification:', userId);
      return;
    }
    
    const result = await createNotification(userId, title, message, entityType, entityId, link);
    if (!result.success) {
      console.error('Failed to create notification:', result.error);
    }
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

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
    console.log({
      id: taskId,
      title: taskTitle,
      description: taskDescription,
      module: targetModule,
      status: taskStatus,
      employee_id: employeeId,
      requester_id: requesterId,
      personnel_request_id: requestId
    });
    
    // Actually create the task in database
    // Use type assertion to bypass TypeScript's checking since the table exists but isn't in types
    const { error: taskError } = await (supabase
      .from('tasks' as any)
      .insert({
        id: taskId,
        title: taskTitle,
        description: taskDescription,
        module: targetModule,
        status: taskStatus,
        employee_id: employeeId,
        requester_id: requesterId,
        personnel_request_id: requestId
      }) as any);
      
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
    
    toast.success("Task created and notifications sent successfully");
  } catch (error) {
    console.error('Error creating task:', error instanceof Error ? error.message : String(error));
    toast.error("Failed to create task: Unexpected error");
  }
};
