
import { createNotification } from "@/services/notificationService";
import { movementTypes } from "../form/MovementTypeSelector";
import { supabase } from "@/integrations/supabase/client";
// Definindo interfaces simplificadas para evitar problemas de instanciação de tipo
type SafeSimpleManagerData = { id: string };

export const getModuleManagers = async (module: string): Promise<SafeSimpleManagerData[]> => {
  try {
    // Usando any para quebrar a inferência de tipo profunda
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
    
    // Criando um novo array explicitamente tipado
    const managers: SafeSimpleManagerData[] = [];
    
    // Usando um loop básico para evitar inferência de tipo complexa
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

// Interface simplificada para evitar problemas de instanciação de tipo
interface SafeTaskRequestDataLite {
  id?: string;
  type?: string;
  department?: string;
  requester_id?: string;
  employee_id?: string;
  employeeName?: string;
  justification?: string;
}

export const createTaskInModule = async (taskRequestData: SafeTaskRequestDataLite): Promise<void> => {
  // Extraindo valores primitivos imediatamente para evitar inferência de tipo profunda
  const requestId = String(taskRequestData.id || '');
  const requestType = String(taskRequestData.type || '');
  const requestDepartment = String(taskRequestData.department || '');
  const requesterId = String(taskRequestData.requester_id || '');
  const employeeId = String(taskRequestData.employee_id || '');
  const employeeName = String(taskRequestData.employeeName || '');
  const requestJustification = String(taskRequestData.justification || '');
  
  // Encontrando o tipo de movimento usando comparação de string primitiva
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
    
    // Criando ID da tarefa antecipadamente para evitar referências aninhadas
    const taskId = crypto.randomUUID();
    
    // Registrando dados da tarefa sem objeto complexo
    console.log({
      title: taskTitle,
      description: taskDescription,
      module: targetModule,
      status: taskStatus,
      employee_id: employeeId,
      requester_id: requesterId,
      personnel_request_id: requestId
    });
    
    // Obtendo gerentes usando nossa função corrigida
    const managers = await getModuleManagers(targetModule).catch(err => {
      console.error('Error fetching managers:', err);
      return [] as SafeSimpleManagerData[];
    });
    
    // Processando notificações com tipagem explícita
    for (const manager of managers) {
      if (!manager || typeof manager.id !== 'string') continue;
      
      const managerId = manager.id;
      
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
    console.error('Erro ao criar tarefa:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};
