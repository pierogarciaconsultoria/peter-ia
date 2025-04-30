
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

// Criando uma função auxiliar separada para notificação para evitar inferência profunda de tipos
const notifyManager = (
  managerId: string,
  title: string,
  message: string,
  type: string, 
  referenceId: string
): Promise<{success: boolean; error?: any}> => {
  return createNotification(
    managerId,
    title,
    message,
    type,
    referenceId
  );
};

// Usando tipagem explícita para evitar inferência excessiva
export const createTaskInModule = async (requestData: TaskRequestDataLite): Promise<void> => {
  // Criar uma variável intermediária com tipagem explícita para interromper a inferência em cadeia
  const request: TaskRequestDataLite = requestData;
  
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
    
    // Utilizando uma abordagem mais explícita para evitar inferência complexa
    const notificationPromises: Promise<{success: boolean; error?: any}>[] = [];
    
    for (const manager of moduleManagers) {
      notificationPromises.push(
        notifyManager(
          manager.id,
          `Nova tarefa de ${movementType.label}`,
          `Uma nova tarefa foi criada para ${request.employeeName || 'um colaborador'}`,
          "task",
          simulatedTask.id
        )
      );
    }
    
    await Promise.all(notificationPromises);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro ao criar tarefa:', error.message);
    }
    throw error;
  }
};
