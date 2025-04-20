
import { PersonnelRequest } from "../types";
import { createNotification } from "@/services/notificationService";
import { movementTypes } from "../form/MovementTypeSelector";
import { supabase } from "@/integrations/supabase/client";

// Define a simple interface for manager data
interface ManagerData {
  id: string;
}

// Define the expected database row type
interface UserProfileRow {
  id: string;
  role: string;
  module: string;
}

export const getModuleManagers = async (module: string): Promise<ManagerData[]> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select<'user_profiles', UserProfileRow>('id')
      .eq('role', 'manager')
      .eq('module', module);
    
    if (error) {
      console.error('Error fetching module managers:', error);
      return [];
    }
    
    return (data || []).map(row => ({
      id: row.id
    }));
  } catch (err) {
    console.error('Exception when fetching module managers:', err);
    return [];
  }
};

export const createTaskInModule = async (request: PersonnelRequest): Promise<void> => {
  const movementType = movementTypes.find(type => type.id === request.type);
  if (!movementType) return;

  try {
    console.log(`Creating task in module: ${movementType.targetModule}`);
    console.log({
      title: `${movementType.label} - ${request.employeeName}`,
      description: request.justification,
      module: movementType.targetModule,
      status: 'pending',
      employee_id: request.employee_id,
      requester_id: request.requester_id,
      personnel_request_id: request.id
    });
    
    // Create a simulated response for demonstration purposes
    const simulatedResponseData = [{
      id: crypto.randomUUID(),
      title: `${movementType.label} - ${request.employeeName}`,
      status: 'pending'
    }];

    const moduleManagers = await getModuleManagers(movementType.targetModule);
    for (const manager of moduleManagers) {
      await createNotification(
        manager.id,
        `Nova tarefa de ${movementType.label}`,
        `Uma nova tarefa foi criada para ${request.employeeName}`,
        "task",
        simulatedResponseData[0].id
      );
    }
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    throw error;
  }
};
