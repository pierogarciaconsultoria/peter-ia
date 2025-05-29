
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface VacationRequest {
  id: string;
  employee_id: string;
  company_id: string;
  start_date: string;
  end_date: string;
  days_requested: number;
  vacation_period_start: string;
  vacation_period_end: string;
  vacation_type: 'regular' | 'proportional';
  status: 'pending' | 'approved' | 'rejected';
  justification?: string;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  employee?: {
    id: string;
    name: string;
    email: string;
    department: string;
    position: string;
    hire_date: string;
  };
}

type VacationRequestInsert = Omit<VacationRequest, 'id' | 'created_at' | 'updated_at' | 'employee'>;
type VacationRequestUpdate = Partial<Omit<VacationRequest, 'id' | 'created_at' | 'updated_at' | 'employee'>>;

export const useVacations = () => {
  const [vacationRequests, setVacationRequests] = useState<VacationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userCompany, isSuperAdmin } = useAuth();

  useEffect(() => {
    fetchVacationRequests();
  }, [userCompany, isSuperAdmin]);

  const fetchVacationRequests = async () => {
    setLoading(true);
    setError(null);

    try {
      let query = (supabase as any)
        .from('vacation_requests')
        .select(`
          *,
          employee:employees!vacation_requests_employee_id_fkey(
            id,
            name,
            email,
            department,
            position,
            hire_date
          )
        `)
        .order('created_at', { ascending: false });

      if (userCompany && !isSuperAdmin) {
        query = query.eq('company_id', userCompany.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching vacation requests:", error);
        setError(error.message || "Failed to load vacation requests");
        toast.error("Erro ao carregar solicitações de férias");
      } else {
        setVacationRequests((data as any) || []);
      }
    } catch (error: any) {
      console.error("Unexpected error fetching vacation requests:", error);
      setError(error.message || "An unexpected error occurred");
      toast.error("Erro inesperado ao carregar solicitações de férias");
    } finally {
      setLoading(false);
    }
  };

  const addVacationRequest = async (newRequest: VacationRequestInsert) => {
    setLoading(true);
    setError(null);

    try {
      const requestData = {
        ...newRequest,
        company_id: userCompany?.id || '',
      };

      const { data, error } = await (supabase as any)
        .from('vacation_requests')
        .insert([requestData])
        .select(`
          *,
          employee:employees!vacation_requests_employee_id_fkey(
            id,
            name,
            email,
            department,
            position,
            hire_date
          )
        `)
        .single();

      if (error) {
        console.error("Error adding vacation request:", error);
        setError(error.message || "Failed to add vacation request");
        toast.error("Erro ao adicionar solicitação de férias");
      } else {
        setVacationRequests(prev => [(data as any), ...prev]);
        toast.success("Solicitação de férias adicionada com sucesso");
      }
    } catch (error: any) {
      console.error("Unexpected error adding vacation request:", error);
      setError(error.message || "An unexpected error occurred");
      toast.error("Erro inesperado ao adicionar solicitação de férias");
    } finally {
      setLoading(false);
    }
  };

  const updateVacationRequest = async (requestId: string, updates: VacationRequestUpdate) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await (supabase as any)
        .from('vacation_requests')
        .update(updates)
        .eq('id', requestId)
        .select(`
          *,
          employee:employees!vacation_requests_employee_id_fkey(
            id,
            name,
            email,
            department,
            position,
            hire_date
          )
        `)
        .single();

      if (error) {
        console.error("Error updating vacation request:", error);
        setError(error.message || "Failed to update vacation request");
        toast.error("Erro ao atualizar solicitação de férias");
      } else {
        setVacationRequests(prev =>
          prev.map(request => (request.id === requestId ? (data as any) : request))
        );
        toast.success("Solicitação de férias atualizada com sucesso");
      }
    } catch (error: any) {
      console.error("Unexpected error updating vacation request:", error);
      setError(error.message || "An unexpected error occurred");
      toast.error("Erro inesperado ao atualizar solicitação de férias");
    } finally {
      setLoading(false);
    }
  };

  const deleteVacationRequest = async (requestId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await (supabase as any)
        .from('vacation_requests')
        .delete()
        .eq('id', requestId);

      if (error) {
        console.error("Error deleting vacation request:", error);
        setError(error.message || "Failed to delete vacation request");
        toast.error("Erro ao excluir solicitação de férias");
      } else {
        setVacationRequests(prev =>
          prev.filter(request => request.id !== requestId)
        );
        toast.success("Solicitação de férias excluída com sucesso");
      }
    } catch (error: any) {
      console.error("Unexpected error deleting vacation request:", error);
      setError(error.message || "An unexpected error occurred");
      toast.error("Erro inesperado ao excluir solicitação de férias");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return {
    vacationRequests,
    loading,
    isLoading: loading,
    error,
    addVacationRequest,
    updateVacationRequest,
    deleteVacationRequest,
    formatDate,
    fetchVacationRequests,
  };
};
