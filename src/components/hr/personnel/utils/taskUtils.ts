
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
    // Use uma interface explícita para o retorno da query
    interface UserProfile {
      id: string;
    }
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('role', 'manager')
      .eq('module', module);
      
    if (error) {
      console.error('Error fetching module managers:', error);
      return [];
    }
    
    // Conversão explícita do tipo retornado
    const typedData = data as UserProfile[] | null;
    return typedData?.map(manager => ({ id: manager.id })) ?? [];
  } catch (err) {
    console.error('Exception when fetching module managers:', err instanceof Error ? err.message : 'Unknown error');
    return [];
  }
};

export const createTaskInModule = async (taskRequestData: TaskRequestDataLite): Promise<void> => {
  // Extrair valores primitivos imediatamente para evitar inferência de tipo profunda
  const requestId = String(taskRequestData.id);
  const requestType = String(taskRequestData.type);
  const requestDepartment = String(taskRequestData.department);
  const requesterId = String(taskRequestData.requester_id);
  const employeeId = String(taskRequestData.employee_id);
  const employeeName = String(taskRequestData.employeeName || '');
  const requestJustification = String(taskRequestData.justification || '');
  
  // Encontrar tipo de movimento usando comparação de string primitiva
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
    
    // Criar ID da tarefa antecipadamente para evitar referências aninhadas
    const taskId = crypto.randomUUID();
    
    // Registrar dados da tarefa sem objeto complexo
    console.log({
      title: taskTitle,
      description: taskDescription,
      module: targetModule,
      status: taskStatus,
      employee_id: employeeId,
      requester_id: requesterId,
      personnel_request_id: requestId
    });
    
    // Buscar gerentes usando tipo explícito para o resultado
    let managers: SimpleManagerData[] = [];
    try {
      managers = await getModuleManagers(targetModule);
    } catch (err) {
      console.error('Error fetching managers:', err);
      managers = [];
    }
    
    // Processar cada notificação individualmente com tipos de string explícitos
    for (let j = 0; j < managers.length; j++) {
      // Verificação de segurança e tipagem explícita
      if (!managers[j] || !managers[j].id) continue;
      
      const managerId = String(managers[j].id);
      if (!managerId) continue;
      
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
    if (error instanceof Error) {
      console.error('Erro ao criar tarefa:', error.message);
    }
    throw error;
  }
};
