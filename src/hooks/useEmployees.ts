
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Employee {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hire_date: string;
  company_id: string;
  status: string;
  avatar_url?: string;
  empresa_id?: string;
  updated_at: string;
}

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userCompany, isSuperAdmin } = useAuth();

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from('employees')
          .select('*')
          .order('created_at', { ascending: false });

        if (userCompany && !isSuperAdmin) {
          query = query.eq('company_id', userCompany.id);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching employees:", error);
          setError(error.message || "Failed to load employees");
          toast.error("Erro ao carregar funcionários");
        } else {
          setEmployees(data || []);
        }
      } catch (error: any) {
        console.error("Unexpected error fetching employees:", error);
        setError(error.message || "An unexpected error occurred");
        toast.error("Erro inesperado ao carregar funcionários");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [userCompany, isSuperAdmin]);

  const addEmployee = async (newEmployee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    setError(null);

    try {
      const employeeData = {
        ...newEmployee,
        company_id: userCompany?.id || '',
        status: newEmployee.status || "active",
      };

      const { data, error } = await supabase
        .from('employees')
        .insert([employeeData])
        .select('*')
        .single();

      if (error) {
        console.error("Error adding employee:", error);
        setError(error.message || "Failed to add employee");
        toast.error("Erro ao adicionar funcionário");
      } else {
        setEmployees(prevEmployees => [...prevEmployees, data]);
        toast.success("Funcionário adicionado com sucesso");
      }
    } catch (error: any) {
      console.error("Unexpected error adding employee:", error);
      setError(error.message || "An unexpected error occurred");
      toast.error("Erro inesperado ao adicionar funcionário");
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = async (employeeId: string, updates: Partial<Employee>) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('employees')
        .update(updates)
        .eq('id', employeeId)
        .select('*')
        .single();

      if (error) {
        console.error("Error updating employee:", error);
        setError(error.message || "Failed to update employee");
        toast.error("Erro ao atualizar funcionário");
      } else {
        setEmployees(prevEmployees =>
          prevEmployees.map(employee => (employee.id === employeeId ? data : employee))
        );
        toast.success("Funcionário atualizado com sucesso");
      }
    } catch (error: any) {
      console.error("Unexpected error updating employee:", error);
      setError(error.message || "An unexpected error occurred");
      toast.error("Erro inesperado ao atualizar funcionário");
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (employeeId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employeeId);

      if (error) {
        console.error("Error deleting employee:", error);
        setError(error.message || "Failed to delete employee");
        toast.error("Erro ao excluir funcionário");
      } else {
        setEmployees(prevEmployees =>
          prevEmployees.filter(employee => employee.id !== employeeId)
        );
        toast.success("Funcionário excluído com sucesso");
      }
    } catch (error: any) {
      console.error("Unexpected error deleting employee:", error);
      setError(error.message || "An unexpected error occurred");
      toast.error("Erro inesperado ao excluir funcionário");
    } finally {
      setLoading(false);
    }
  };

  // Função helper para formatar datas
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return {
    employees,
    loading,
    isLoading: loading, // Alias para compatibilidade
    error,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    formatDate,
  };
};
