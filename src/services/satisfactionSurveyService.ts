
import { supabase } from "@/integrations/supabase/client";

export interface SatisfactionSurvey {
  id: string;
  title: string;
  customer_name: string;
  survey_date: string;
  overall_satisfaction?: number;
  product_quality?: number;
  service_quality?: number;
  delivery_satisfaction?: number;
  suggestions?: string;
  status: 'draft' | 'sent' | 'completed';
  company_id?: string;
  created_at: string;
  updated_at: string;
}

export async function getSatisfactionSurveys(): Promise<SatisfactionSurvey[]> {
  try {
    const { data, error } = await supabase
      .from('customer_satisfaction_surveys')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Erro ao buscar pesquisas de satisfação:", error.message);
      return [];
    }
    
    return (data || []) as SatisfactionSurvey[];
  } catch (error) {
    console.error("Erro inesperado ao buscar customer_satisfaction_surveys:", error);
    return [];
  }
}

export async function getSatisfactionSurveyById(id: string): Promise<SatisfactionSurvey> {
  try {
    const { data, error } = await supabase
      .from('customer_satisfaction_surveys')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Erro ao buscar pesquisa de satisfação por ID:", error.message);
      throw new Error("Survey não encontrado");
    }
    
    return data as SatisfactionSurvey;
  } catch (error) {
    console.error("Erro inesperado ao buscar satisfaction survey por ID:", error);
    throw new Error("Survey não encontrado");
  }
}

export async function createSatisfactionSurvey(survey: Omit<SatisfactionSurvey, 'id' | 'created_at' | 'updated_at'>): Promise<SatisfactionSurvey> {
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
      .from('customer_satisfaction_surveys')
      .insert({
        ...survey,
        company_id: profileData.company_id
      })
      .select()
      .single();
    
    if (error) {
      console.error("Erro ao criar satisfaction survey:", error.message);
      throw new Error("Falha ao criar pesquisa de satisfação");
    }
    
    return data as SatisfactionSurvey;
  } catch (error) {
    console.error("Erro inesperado ao criar satisfaction survey:", error);
    throw new Error("Falha ao criar pesquisa de satisfação");
  }
}

export async function updateSatisfactionSurvey(id: string, survey: Partial<Omit<SatisfactionSurvey, 'id' | 'created_at' | 'updated_at'>>): Promise<SatisfactionSurvey> {
  try {
    const { data, error } = await supabase
      .from('customer_satisfaction_surveys')
      .update(survey)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Erro ao atualizar satisfaction survey:", error.message);
      throw new Error("Falha ao atualizar pesquisa de satisfação");
    }
    
    return data as SatisfactionSurvey;
  } catch (error) {
    console.error("Erro inesperado ao atualizar satisfaction survey:", error);
    throw new Error("Falha ao atualizar pesquisa de satisfação");
  }
}

export async function deleteSatisfactionSurvey(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('customer_satisfaction_surveys')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Erro ao deletar satisfaction survey:", error.message);
    }
  } catch (error) {
    console.error("Erro inesperado ao deletar satisfaction survey:", error);
  }
}
