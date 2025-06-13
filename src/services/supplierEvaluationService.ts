
import { supabase } from "@/integrations/supabase/client";

export interface SupplierEvaluation {
  id: string;
  supplier_name: string;
  evaluation_date: string;
  evaluator: string;
  category: string;
  quality_score?: number;
  delivery_score?: number;
  price_score?: number;
  support_score?: number;
  total_score?: number;
  status: 'active' | 'inactive';
  comments?: string;
  company_id?: string;
  created_at: string;
  updated_at: string;
}

export async function getSupplierEvaluations(): Promise<SupplierEvaluation[]> {
  try {
    const { data, error } = await supabase
      .from('supplier_evaluations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Erro ao buscar avaliações de fornecedores:", error.message);
      return [];
    }
    
    return (data || []).map(item => ({
      ...item,
      status: (item.status === 'active' || item.status === 'inactive') ? item.status : 'active'
    })) as SupplierEvaluation[];
  } catch (error) {
    console.error("Erro inesperado ao buscar supplier_evaluations:", error);
    return [];
  }
}

export async function getSupplierEvaluationById(id: string): Promise<SupplierEvaluation | null> {
  try {
    const { data, error } = await supabase
      .from('supplier_evaluations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Erro ao buscar avaliação por ID:", error.message);
      return null;
    }
    
    const result = {
      ...data,
      status: (data.status === 'active' || data.status === 'inactive') ? data.status : 'active'
    } as SupplierEvaluation;
    
    return result;
  } catch (error) {
    console.error("Erro inesperado ao buscar supplier evaluation por ID:", error);
    return null;
  }
}

export async function createSupplierEvaluation(evaluation: Omit<SupplierEvaluation, 'id' | 'created_at' | 'updated_at' | 'total_score'>): Promise<SupplierEvaluation | null> {
  try {
    // Get user's company ID
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      throw new Error("Usuário não autenticado");
    }

    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('company_id')
      .eq('id', userData.user.id)
      .single();

    if (!profileData?.company_id) {
      throw new Error("Empresa do usuário não encontrada");
    }

    const { data, error } = await supabase
      .from('supplier_evaluations')
      .insert({
        ...evaluation,
        company_id: profileData.company_id
      })
      .select()
      .single();
    
    if (error) {
      console.error("Erro ao criar supplier evaluation:", error.message);
      return null;
    }
    
    const result = {
      ...data,
      status: (data.status === 'active' || data.status === 'inactive') ? data.status : 'active'
    } as SupplierEvaluation;
    
    return result;
  } catch (error) {
    console.error("Erro inesperado ao criar supplier evaluation:", error);
    return null;
  }
}

export async function updateSupplierEvaluation(id: string, evaluation: Partial<Omit<SupplierEvaluation, 'id' | 'created_at' | 'updated_at' | 'total_score'>>): Promise<SupplierEvaluation | null> {
  try {
    const { data, error } = await supabase
      .from('supplier_evaluations')
      .update(evaluation)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Erro ao atualizar supplier evaluation:", error.message);
      return null;
    }
    
    const result = {
      ...data,
      status: (data.status === 'active' || data.status === 'inactive') ? data.status : 'active'
    } as SupplierEvaluation;
    
    return result;
  } catch (error) {
    console.error("Erro inesperado ao atualizar supplier evaluation:", error);
    return null;
  }
}

export async function deleteSupplierEvaluation(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('supplier_evaluations')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Erro ao deletar supplier evaluation:", error.message);
    }
  } catch (error) {
    console.error("Erro inesperado ao deletar supplier evaluation:", error);
  }
}
