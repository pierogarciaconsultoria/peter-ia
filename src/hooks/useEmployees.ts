
import { useState, useEffect } from 'react';
import { employeeService, Employee } from '@/services/employeeService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { userCompany } = useAuth();

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!userCompany?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await employeeService.getEmployees(userCompany.id);
        setEmployees(data);
      } catch (err: any) {
        console.error('Error fetching employees:', err);
        setError('Erro ao carregar funcionários');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [userCompany?.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const refreshEmployees = async () => {
    if (userCompany?.id) {
      try {
        const data = await employeeService.getEmployees(userCompany.id);
        setEmployees(data);
      } catch (err: any) {
        console.error('Error refreshing employees:', err);
        setError('Erro ao atualizar funcionários');
      }
    }
  };

  const updateEmployee = async (id: string, updates: Partial<Employee>) => {
    try {
      setIsLoading(true);
      await employeeService.updateEmployee(id, updates);
      toast.success('Funcionário atualizado com sucesso');
      await refreshEmployees();
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error('Erro ao atualizar funcionário');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      setIsLoading(true);
      await employeeService.deleteEmployee(id);
      toast.success('Funcionário excluído com sucesso');
      await refreshEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Erro ao excluir funcionário');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    employees,
    loading,
    error,
    isLoading,
    formatDate,
    refreshEmployees,
    updateEmployee,
    deleteEmployee
  };
};
