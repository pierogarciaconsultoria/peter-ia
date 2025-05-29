
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface DevelopmentPlan {
  id: string;
  employee_id: string;
  title: string;
  status: 'active' | 'completed' | 'cancelled';
  start_date: string;
  end_date: string;
  progress: number;
  career_goal?: string;
  development_areas: any;
  action_items: any;
  company_id: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
  employee?: {
    id: string;
    name: string;
    position: string;
    department: string;
  };
}

export const useDevelopmentPlans = () => {
  const [developmentPlans, setDevelopmentPlans] = useState<DevelopmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userCompany } = useAuth();

  useEffect(() => {
    fetchDevelopmentPlans();
  }, [userCompany]);

  const fetchDevelopmentPlans = async () => {
    setLoading(true);
    setError(null);

    try {
      let query = (supabase as any)
        .from('development_plans')
        .select(`
          *,
          employee:employees!development_plans_employee_id_fkey(
            id,
            name,
            position,
            department
          )
        `)
        .order('created_at', { ascending: false });

      if (userCompany) {
        query = query.eq('company_id', userCompany.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching development plans:", error);
        setError(error.message || "Failed to load development plans");
        toast.error("Erro ao carregar planos de desenvolvimento");
      } else {
        setDevelopmentPlans((data as any) || []);
      }
    } catch (error: any) {
      console.error("Unexpected error fetching development plans:", error);
      setError(error.message || "An unexpected error occurred");
      toast.error("Erro inesperado ao carregar planos de desenvolvimento");
    } finally {
      setLoading(false);
    }
  };

  const addDevelopmentPlan = async (newPlan: Omit<DevelopmentPlan, 'id' | 'created_at' | 'updated_at' | 'employee'>) => {
    setLoading(true);
    setError(null);

    try {
      const planData = {
        ...newPlan,
        company_id: userCompany?.id || '',
      };

      const { data, error } = await (supabase as any)
        .from('development_plans')
        .insert([planData])
        .select(`
          *,
          employee:employees!development_plans_employee_id_fkey(
            id,
            name,
            position,
            department
          )
        `)
        .single();

      if (error) {
        console.error("Error adding development plan:", error);
        setError(error.message || "Failed to add development plan");
        toast.error("Erro ao adicionar plano de desenvolvimento");
      } else {
        setDevelopmentPlans(prev => [(data as any), ...prev]);
        toast.success("Plano de desenvolvimento adicionado com sucesso");
      }
    } catch (error: any) {
      console.error("Unexpected error adding development plan:", error);
      setError(error.message || "An unexpected error occurred");
      toast.error("Erro inesperado ao adicionar plano de desenvolvimento");
    } finally {
      setLoading(false);
    }
  };

  const updateDevelopmentPlan = async (planId: string, updates: Partial<DevelopmentPlan>) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await (supabase as any)
        .from('development_plans')
        .update(updates)
        .eq('id', planId)
        .select(`
          *,
          employee:employees!development_plans_employee_id_fkey(
            id,
            name,
            position,
            department
          )
        `)
        .single();

      if (error) {
        console.error("Error updating development plan:", error);
        setError(error.message || "Failed to update development plan");
        toast.error("Erro ao atualizar plano de desenvolvimento");
      } else {
        setDevelopmentPlans(prev =>
          prev.map(plan => (plan.id === planId ? (data as any) : plan))
        );
        toast.success("Plano de desenvolvimento atualizado com sucesso");
      }
    } catch (error: any) {
      console.error("Unexpected error updating development plan:", error);
      setError(error.message || "An unexpected error occurred");
      toast.error("Erro inesperado ao atualizar plano de desenvolvimento");
    } finally {
      setLoading(false);
    }
  };

  const deleteDevelopmentPlan = async (planId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await (supabase as any)
        .from('development_plans')
        .delete()
        .eq('id', planId);

      if (error) {
        console.error("Error deleting development plan:", error);
        setError(error.message || "Failed to delete development plan");
        toast.error("Erro ao excluir plano de desenvolvimento");
      } else {
        setDevelopmentPlans(prev =>
          prev.filter(plan => plan.id !== planId)
        );
        toast.success("Plano de desenvolvimento excluído com sucesso");
      }
    } catch (error: any) {
      console.error("Unexpected error deleting development plan:", error);
      setError(error.message || "An unexpected error occurred");
      toast.error("Erro inesperado ao excluir plano de desenvolvimento");
    } finally {
      setLoading(false);
    }
  };

  return {
    developmentPlans,
    loading,
    error,
    addDevelopmentPlan,
    updateDevelopmentPlan,
    deleteDevelopmentPlan,
    fetchDevelopmentPlans,
  };
};
