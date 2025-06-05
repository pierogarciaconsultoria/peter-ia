
import { useState, useEffect } from 'react';
import { employeeService, Employee } from '@/services/employeeService';
import { useAuth } from '@/contexts/AuthContext';

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  return {
    employees,
    loading,
    error,
    formatDate,
    refreshEmployees
  };
};
