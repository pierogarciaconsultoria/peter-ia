
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
  created_at: string;
  updated_at: string;
}

// Mock data para demonstração até a tabela ser criada
const mockSatisfactionSurveys: SatisfactionSurvey[] = [
  {
    id: '1',
    title: 'Pesquisa de Satisfação Q1 2024',
    customer_name: 'Cliente A',
    survey_date: '2024-01-15',
    overall_satisfaction: 8,
    product_quality: 9,
    service_quality: 7,
    delivery_satisfaction: 8,
    suggestions: 'Melhorar o atendimento pós-venda',
    status: 'completed',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  }
];

export async function getSatisfactionSurveys(): Promise<SatisfactionSurvey[]> {
  try {
    const { data, error } = await supabase
      .from('customer_satisfaction_surveys')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.warn("Tabela 'customer_satisfaction_surveys' não existe, usando dados mock:", error.message);
      return mockSatisfactionSurveys;
    }
    
    return data || [];
  } catch (error) {
    console.warn("Erro ao acessar customer_satisfaction_surveys, usando dados mock:", error);
    return mockSatisfactionSurveys;
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
      console.warn("Tabela 'customer_satisfaction_surveys' não existe, usando dados mock");
      const survey = mockSatisfactionSurveys.find(item => item.id === id);
      if (!survey) {
        throw new Error("Survey não encontrado");
      }
      return survey;
    }
    
    return data;
  } catch (error) {
    console.warn("Erro ao acessar customer_satisfaction_surveys, usando dados mock:", error);
    const survey = mockSatisfactionSurveys.find(item => item.id === id);
    if (!survey) {
      throw new Error("Survey não encontrado");
    }
    return survey;
  }
}

export async function createSatisfactionSurvey(survey: Omit<SatisfactionSurvey, 'id' | 'created_at' | 'updated_at'>): Promise<SatisfactionSurvey> {
  try {
    const { data, error } = await supabase
      .from('customer_satisfaction_surveys')
      .insert(survey)
      .select()
      .single();
    
    if (error) {
      console.warn("Tabela 'customer_satisfaction_surveys' não existe, simulando criação");
      const newSurvey: SatisfactionSurvey = {
        ...survey,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return newSurvey;
    }
    
    return data;
  } catch (error) {
    console.error("Erro ao criar satisfaction survey:", error);
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
      console.warn("Tabela 'customer_satisfaction_surveys' não existe, simulando atualização");
      throw new Error("Tabela não existe no banco de dados atual");
    }
    
    return data;
  } catch (error) {
    console.error("Erro ao atualizar satisfaction survey:", error);
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
      console.warn("Tabela 'customer_satisfaction_surveys' não existe, simulando exclusão");
    }
  } catch (error) {
    console.error("Erro ao deletar satisfaction survey:", error);
  }
}
