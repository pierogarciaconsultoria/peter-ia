
import { PersonnelRequest } from "../types";
import { createNotification } from "@/services/notificationService";
import { movementTypes } from "../form/MovementTypeSelector";
import { supabase } from "@/integrations/supabase/client";
import { SimpleManagerData, TaskCreationData, CreatedTask } from "../types/taskTypes";

// Simple schedule interface without recursion
interface BasicSchedule {
  start1: string;
  end1: string;
  start2: string;
  end2: string;
}

// Base interface without circular references
interface BasicPersonnelRequest {
  id: string;
  type: string;
  department: string;
  position: string;
  position_id: string;
  requestDate: string;
  status: string;
  requester: string;
  requester_id: string;
  employeeName: string;
  employee_id: string;
  justification?: string;
  currentSalary?: string;
  proposedSalary?: string;
  currentPosition?: string;
  proposedPosition?: string;
  approved_by?: string;
  approval_date?: string;
  rejection_reason?: string;
  targetDate?: string;
  currentSchedule?: BasicSchedule;
  proposedSchedule?: BasicSchedule;
  hr_observation?: string;
}

export const getModuleManagers = async (module: string): Promise<SimpleManagerData[]> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('role', 'manager')
      .eq('module', module);
      
    if (error) {
      console.error('Error fetching module managers:', error);
      return [];
    }
    
    return data?.map(manager => ({ id: manager.id })) ?? [];
  } catch (err) {
    console.error('Exception when fetching module managers:', err instanceof Error ? err.message : 'Unknown error');
    return [];
  }
};

// Use the non-recursive interface for the parameter
export const createTaskInModule = async (request: BasicPersonnelRequest): Promise<void> => {
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
    
    const simulatedTask: CreatedTask = {
      id: crypto.randomUUID(),
      title: taskData.title,
      status: 'pending'
    };

    const moduleManagers = await getModuleManagers(movementType.targetModule);
    
    await Promise.all(
      moduleManagers.map(manager => 
        createNotification(
          manager.id,
          `Nova tarefa de ${movementType.label}`,
          `Uma nova tarefa foi criada para ${request.employeeName || 'um colaborador'}`,
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
