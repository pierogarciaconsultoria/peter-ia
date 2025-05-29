
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface ApprovedPosition {
  id: string;
  job_position_id: string;
  department_id: string;
  approved_count: number;
  filled_count: number;
  company_id: string;
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Join data
  job_position?: {
    id: string;
    title: string;
    code?: string;
    department_id: string;
  };
  department?: {
    id: string;
    name: string;
  };
}

export interface ApprovedPositionSummary {
  department: string;
  approved: number;
  filled: number;
  open: number;
}

type ApprovedPositionInsert = Omit<ApprovedPosition, 'id' | 'created_at' | 'updated_at' | 'job_position' | 'department'>;
type ApprovedPositionUpdate = Partial<Omit<ApprovedPosition, 'id' | 'created_at' | 'updated_at' | 'job_position' | 'department'>>;

export const useApprovedPositions = () => {
  const [positions, setPositions] = useState<ApprovedPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userCompany, isSuperAdmin } = useAuth();

  const fetchPositions = async () => {
    if (!userCompany && !isSuperAdmin) return;
    
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('hr_approved_positions')
        .select(`
          *,
          job_position:job_positions!inner(
            id,
            title,
            code,
            department_id
          ),
          department:departments!inner(
            id,
            name
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (userCompany && !isSuperAdmin) {
        query = query.eq('company_id', userCompany.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching approved positions:", error);
        setError(error.message || "Failed to load approved positions");
        toast.error("Erro ao carregar posições aprovadas");
      } else {
        // Transform the data to ensure type compatibility
        const transformedData: ApprovedPosition[] = (data || []).map((item: any) => ({
          ...item,
          // Ensure department has the correct structure with null check
          department: item.department && typeof item.department === 'object' && 'id' in item.department
            ? item.department 
            : { id: '', name: 'Departamento desconhecido' }
        }));
        setPositions(transformedData);
      }
    } catch (error: any) {
      console.error("Unexpected error fetching approved positions:", error);
      setError(error.message || "An unexpected error occurred");
      toast.error("Erro inesperado ao carregar posições aprovadas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, [userCompany, isSuperAdmin]);

  const addPosition = async (newPosition: ApprovedPositionInsert) => {
    setLoading(true);
    setError(null);

    try {
      const positionData = {
        ...newPosition,
        company_id: userCompany?.id || '',
      };

      const { data, error } = await supabase
        .from('hr_approved_positions')
        .insert([positionData])
        .select(`
          *,
          job_position:job_positions!inner(
            id,
            title,
            code,
            department_id
          ),
          department:departments!inner(
            id,
            name
          )
        `)
        .single();

      if (error) {
        console.error("Error adding approved position:", error);
        setError(error.message || "Failed to add approved position");
        toast.error("Erro ao adicionar posição aprovada");
      } else {
        // Transform the data to ensure type compatibility with null check
        const transformedData: ApprovedPosition = {
          ...data,
          department: data.department && typeof data.department === 'object' && 'id' in data.department
            ? data.department 
            : { id: '', name: 'Departamento desconhecido' }
        };
        setPositions(prevPositions => [transformedData, ...prevPositions]);
        toast.success("Posição aprovada adicionada com sucesso");
      }
    } catch (error: any) {
      console.error("Unexpected error adding approved position:", error);
      setError(error.message || "An unexpected error occurred");
      toast.error("Erro inesperado ao adicionar posição aprovada");
    } finally {
      setLoading(false);
    }
  };

  const updatePosition = async (positionId: string, updates: ApprovedPositionUpdate) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('hr_approved_positions')
        .update(updates)
        .eq('id', positionId)
        .select(`
          *,
          job_position:job_positions!inner(
            id,
            title,
            code,
            department_id
          ),
          department:departments!inner(
            id,
            name
          )
        `)
        .single();

      if (error) {
        console.error("Error updating approved position:", error);
        setError(error.message || "Failed to update approved position");
        toast.error("Erro ao atualizar posição aprovada");
      } else {
        // Transform the data to ensure type compatibility with null check
        const transformedData: ApprovedPosition = {
          ...data,
          department: data.department && typeof data.department === 'object' && 'id' in data.department
            ? data.department 
            : { id: '', name: 'Departamento desconhecido' }
        };
        setPositions(prevPositions =>
          prevPositions.map(position => (position.id === positionId ? transformedData : position))
        );
        toast.success("Posição aprovada atualizada com sucesso");
      }
    } catch (error: any) {
      console.error("Unexpected error updating approved position:", error);
      setError(error.message || "An unexpected error occurred");
      toast.error("Erro inesperado ao atualizar posição aprovada");
    } finally {
      setLoading(false);
    }
  };

  const deletePosition = async (positionId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('hr_approved_positions')
        .update({ is_active: false })
        .eq('id', positionId);

      if (error) {
        console.error("Error deleting approved position:", error);
        setError(error.message || "Failed to delete approved position");
        toast.error("Erro ao excluir posição aprovada");
      } else {
        setPositions(prevPositions =>
          prevPositions.filter(position => position.id !== positionId)
        );
        toast.success("Posição aprovada excluída com sucesso");
      }
    } catch (error: any) {
      console.error("Unexpected error deleting approved position:", error);
      setError(error.message || "An unexpected error occurred");
      toast.error("Erro inesperado ao excluir posição aprovada");
    } finally {
      setLoading(false);
    }
  };

  // Função para gerar sumário por departamento
  const getPositionsSummary = (): ApprovedPositionSummary[] => {
    const summary: { [key: string]: ApprovedPositionSummary } = {};
    
    positions.forEach(position => {
      const deptName = position.department?.name ?? 'Sem Departamento';
      
      if (!summary[deptName]) {
        summary[deptName] = {
          department: deptName,
          approved: 0,
          filled: 0,
          open: 0
        };
      }
      
      summary[deptName].approved += position.approved_count;
      summary[deptName].filled += position.filled_count;
      summary[deptName].open += Math.max(0, position.approved_count - position.filled_count);
    });
    
    return Object.values(summary);
  };

  // Função para obter totais gerais
  const getTotals = () => {
    const totalApproved = positions.reduce((sum, pos) => sum + pos.approved_count, 0);
    const totalFilled = positions.reduce((sum, pos) => sum + pos.filled_count, 0);
    const totalOpen = totalApproved - totalFilled;
    const filledPercentage = totalApproved > 0 ? Math.round((totalFilled / totalApproved) * 100) : 0;

    return {
      totalApproved,
      totalFilled,
      totalOpen,
      filledPercentage
    };
  };

  return {
    positions,
    loading,
    isLoading: loading, // Alias para compatibilidade
    error,
    addPosition,
    updatePosition,
    deletePosition,
    refetch: fetchPositions,
    getPositionsSummary,
    getTotals,
  };
};
