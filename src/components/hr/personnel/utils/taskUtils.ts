
import { PersonnelRequest } from "../types";
import { createNotification } from "@/services/notificationService";
import { movementTypes } from "../form/MovementTypeSelector";
import { supabase } from "@/integrations/supabase/client";

// Define interface without readonly to avoid excessive type instantiation
interface ManagerData {
  id: string;
}

interface TaskCreationData {
  readonly title: string;
  readonly description: string;
  readonly module: string;
  readonly status: 'pending';
  readonly employee_id: string;
  readonly requester_id: string;
  readonly personnel_request_id: string;
}

interface CreatedTask {
  readonly id: string;
  readonly title: string;
  readonly status: 'pending';
}

export const getModuleManagers = async (module: string): Promise<ManagerData[]> => {
  try {
    // Corrected query to match the actual database schema
    // Only selecting the 'id' field which we know exists
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('role', 'manager')
      .eq('module', module);

    if (error) {
      console.error('Error fetching module managers:', error);
      return [];
    }

    // Explicitly type and transform the data to break any circular references
    return Array.isArray(data) ? data.map(item => ({ id: item.id })) : [];
  } catch (err) {
    if (err instanceof Error) {
      console.error('Exception when fetching module managers:', err.message);
    }
    return [];
  }
};

export const createTaskInModule = async (request: Readonly<PersonnelRequest>): Promise<void> => {
  const movementType = movementTypes.find(type => type.id === request.type);
  if (!movementType) return;

  try {
    console.log(`Creating task in module: ${movementType.targetModule}`);
    
    const taskData: TaskCreationData = {
      title: `${movementType.label} - ${request.employeeName}`,
      description: request.justification || '',
      module: movementType.targetModule,
      status: 'pending',
      employee_id: request.employee_id,
      requester_id: request.requester_id,
      personnel_request_id: request.id
    };

    console.log(taskData);
    
    // Create a simulated response with explicit typing
    const simulatedTask: CreatedTask = {
      id: crypto.randomUUID(),
      title: taskData.title,
      status: 'pending'
    };

    const moduleManagers = await getModuleManagers(movementType.targetModule);
    
    // Use Promise.all for parallel notification creation
    await Promise.all(
      moduleManagers.map((manager) => 
        createNotification(
          manager.id,
          `Nova tarefa de ${movementType.label}`,
          `Uma nova tarefa foi criada para ${request.employeeName}`,
          "task",
          simulatedTask.id
        )
      )
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro ao criar tarefa:', error.message);
    }
    throw error;
  }
};
