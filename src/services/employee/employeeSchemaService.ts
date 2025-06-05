
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { Employee } from './types';

export class EmployeeSchemaService {
  private static instance: EmployeeSchemaService;
  
  public static getInstance(): EmployeeSchemaService {
    if (!EmployeeSchemaService.instance) {
      EmployeeSchemaService.instance = new EmployeeSchemaService();
    }
    return EmployeeSchemaService.instance;
  }

  // Buscar todos os funcionários
  async getEmployees(): Promise<Employee[]> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('name');

      if (error) {
        logger.error('EmployeeSchemaService', 'Erro ao buscar funcionários', error);
        throw error;
      }

      logger.debug('EmployeeSchemaService', 'Funcionários carregados', {
        count: data?.length || 0
      });

      return (data || []) as Employee[];
    } catch (error) {
      logger.error('EmployeeSchemaService', 'Erro inesperado ao buscar funcionários', error);
      throw error;
    }
  }

  // Buscar funcionário por ID
  async getEmployeeById(id: string): Promise<Employee | null> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        logger.error('EmployeeSchemaService', 'Erro ao buscar funcionário por ID', { id, error });
        throw error;
      }

      return data as Employee | null;
    } catch (error) {
      logger.error('EmployeeSchemaService', 'Erro inesperado ao buscar funcionário', error);
      throw error;
    }
  }

  // Buscar funcionários por departamento
  async getEmployeesByDepartment(department: string): Promise<Employee[]> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('department', department)
        .order('name');

      if (error) {
        logger.error('EmployeeSchemaService', 'Erro ao buscar funcionários por departamento', { department, error });
        throw error;
      }

      return (data || []) as Employee[];
    } catch (error) {
      logger.error('EmployeeSchemaService', 'Erro inesperado ao buscar funcionários por departamento', error);
      throw error;
    }
  }

  // Criar novo funcionário
  async createEmployee(employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<Employee> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .insert([employee])
        .select()
        .single();

      if (error) {
        logger.error('EmployeeSchemaService', 'Erro ao criar funcionário', { employee, error });
        throw error;
      }

      logger.info('EmployeeSchemaService', 'Funcionário criado com sucesso', {
        id: data.id,
        name: data.name
      });

      return data as Employee;
    } catch (error) {
      logger.error('EmployeeSchemaService', 'Erro inesperado ao criar funcionário', error);
      throw error;
    }
  }

  // Atualizar funcionário
  async updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error('EmployeeSchemaService', 'Erro ao atualizar funcionário', { id, updates, error });
        throw error;
      }

      logger.info('EmployeeSchemaService', 'Funcionário atualizado com sucesso', {
        id: data.id,
        name: data.name
      });

      return data as Employee;
    } catch (error) {
      logger.error('EmployeeSchemaService', 'Erro inesperado ao atualizar funcionário', error);
      throw error;
    }
  }

  // Deletar funcionário
  async deleteEmployee(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) {
        logger.error('EmployeeSchemaService', 'Erro ao deletar funcionário', { id, error });
        throw error;
      }

      logger.info('EmployeeSchemaService', 'Funcionário deletado com sucesso', { id });

      return true;
    } catch (error) {
      logger.error('EmployeeSchemaService', 'Erro inesperado ao deletar funcionário', error);
      throw error;
    }
  }

  // Verificar se uma tabela existe
  async checkTableExists(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('id')
        .limit(1);
      
      return !error;
    } catch (error) {
      logger.error('EmployeeSchemaService', 'Erro ao verificar se tabela existe', error);
      return false;
    }
  }

  // Listar tabelas do schema atual
  async getSchemaTableList(): Promise<string[]> {
    try {
      // Mock implementation since we can't directly access schema information
      return ['employees', 'departments', 'companies'];
    } catch (error) {
      logger.error('EmployeeSchemaService', 'Erro ao listar tabelas do schema', error);
      return [];
    }
  }
}

// Instância singleton
export const employeeSchemaService = EmployeeSchemaService.getInstance();

// Hook React para usar o serviço
export const useEmployeeSchemaService = () => {
  return {
    service: employeeSchemaService,
    switchContext: (schema: string) => {
      console.log('Schema context switching not implemented:', schema);
    }
  };
};
