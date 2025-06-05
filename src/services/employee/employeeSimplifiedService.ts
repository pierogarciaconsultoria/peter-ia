
import { simplifiedSupabaseClient } from '@/utils/simplifiedSupabaseClient';
import { logger } from '@/utils/logger';
import { Employee } from './types';

export class EmployeeSimplifiedService {
  private static instance: EmployeeSimplifiedService;
  
  public static getInstance(): EmployeeSimplifiedService {
    if (!EmployeeSimplifiedService.instance) {
      EmployeeSimplifiedService.instance = new EmployeeSimplifiedService();
    }
    return EmployeeSimplifiedService.instance;
  }

  // Buscar todos os funcionários
  async getEmployees(): Promise<Employee[]> {
    try {
      const { data, error } = await simplifiedSupabaseClient
        .from('employees')
        .select('*')
        .order('name');

      if (error) {
        logger.error('EmployeeSimplifiedService', 'Erro ao buscar funcionários', error);
        throw error;
      }

      logger.debug('EmployeeSimplifiedService', 'Funcionários carregados', {
        count: data?.length || 0
      });

      return data || [];
    } catch (error) {
      logger.error('EmployeeSimplifiedService', 'Erro inesperado ao buscar funcionários', error);
      throw error;
    }
  }

  // Buscar funcionário por ID
  async getEmployeeById(id: string): Promise<Employee | null> {
    try {
      const { data, error } = await simplifiedSupabaseClient
        .from('employees')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        logger.error('EmployeeSimplifiedService', 'Erro ao buscar funcionário por ID', { id, error });
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('EmployeeSimplifiedService', 'Erro inesperado ao buscar funcionário', error);
      throw error;
    }
  }

  // Buscar funcionários por departamento
  async getEmployeesByDepartment(department: string): Promise<Employee[]> {
    try {
      const { data, error } = await simplifiedSupabaseClient
        .from('employees')
        .select('*')
        .eq('department', department)
        .order('name');

      if (error) {
        logger.error('EmployeeSimplifiedService', 'Erro ao buscar funcionários por departamento', { department, error });
        throw error;
      }

      return data || [];
    } catch (error) {
      logger.error('EmployeeSimplifiedService', 'Erro inesperado ao buscar funcionários por departamento', error);
      throw error;
    }
  }

  // Criar novo funcionário
  async createEmployee(employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<Employee> {
    try {
      const { data, error } = await simplifiedSupabaseClient
        .from('employees')
        .insert([employee])
        .select()
        .single();

      if (error) {
        logger.error('EmployeeSimplifiedService', 'Erro ao criar funcionário', { employee, error });
        throw error;
      }

      logger.info('EmployeeSimplifiedService', 'Funcionário criado com sucesso', {
        id: data.id,
        name: data.name
      });

      return data;
    } catch (error) {
      logger.error('EmployeeSimplifiedService', 'Erro inesperado ao criar funcionário', error);
      throw error;
    }
  }

  // Atualizar funcionário
  async updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee> {
    try {
      const { data, error } = await simplifiedSupabaseClient
        .from('employees')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error('EmployeeSimplifiedService', 'Erro ao atualizar funcionário', { id, updates, error });
        throw error;
      }

      logger.info('EmployeeSimplifiedService', 'Funcionário atualizado com sucesso', {
        id: data.id,
        name: data.name
      });

      return data;
    } catch (error) {
      logger.error('EmployeeSimplifiedService', 'Erro inesperado ao atualizar funcionário', error);
      throw error;
    }
  }

  // Deletar funcionário
  async deleteEmployee(id: string): Promise<boolean> {
    try {
      const { error } = await simplifiedSupabaseClient
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) {
        logger.error('EmployeeSimplifiedService', 'Erro ao deletar funcionário', { id, error });
        throw error;
      }

      logger.info('EmployeeSimplifiedService', 'Funcionário deletado com sucesso', { id });
      return true;
    } catch (error) {
      logger.error('EmployeeSimplifiedService', 'Erro inesperado ao deletar funcionário', error);
      throw error;
    }
  }

  // Verificar se tabela existe
  async checkTableExists(): Promise<boolean> {
    try {
      return await simplifiedSupabaseClient.tableExists('employees');
    } catch (error) {
      logger.error('EmployeeSimplifiedService', 'Erro ao verificar se tabela existe', error);
      return false;
    }
  }
}

// Instância singleton
export const employeeSimplifiedService = EmployeeSimplifiedService.getInstance();

// Hook React para usar o serviço
export const useEmployeeSimplifiedService = () => {
  return {
    service: employeeSimplifiedService
  };
};
