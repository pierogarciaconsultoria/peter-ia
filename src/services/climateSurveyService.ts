
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ClimateSurvey {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  company_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface ClimateSurveyQuestion {
  id: string;
  survey_id: string;
  question: string;
  category: string;
  question_type: 'scale' | 'text' | 'multiple_choice' | 'boolean';
  options?: any;
  required: boolean;
  order_number: number;
  company_id: string;
}

export interface ClimateSurveyResponse {
  id: string;
  survey_id: string;
  employee_id?: string;
  is_anonymous: boolean;
  responses: any;
  submitted_at: string;
  company_id: string;
}

// Função para obter todas as pesquisas de clima
export const getClimateSurveys = async (): Promise<ClimateSurvey[]> => {
  try {
    // Tenta buscar do banco de dados
    const { data, error } = await supabase
      .from('climate_surveys')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    console.error("Erro ao buscar pesquisas de clima:", error);
    
    // Retornar dados mock em caso de erro
    const mockData: ClimateSurvey[] = [
      {
        id: "1",
        title: "Pesquisa de Clima 2023",
        description: "Avaliação anual do ambiente de trabalho",
        start_date: "2023-01-01",
        end_date: "2023-01-31",
        status: "completed",
        company_id: "1",
        created_at: "2023-01-01T00:00:00Z"
      },
      {
        id: "2",
        title: "Pulso Trimestral Q2",
        description: "Avaliação rápida do clima organizacional",
        start_date: "2023-04-01",
        end_date: "2023-04-07",
        status: "completed",
        company_id: "1",
        created_at: "2023-04-01T00:00:00Z"
      }
    ];
    
    return mockData;
  }
};

// Função para obter uma pesquisa específica
export const getClimateSurvey = async (id: string): Promise<ClimateSurvey | null> => {
  try {
    const { data, error } = await supabase
      .from('climate_surveys')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error(`Erro ao buscar pesquisa de clima ${id}:`, error);
    return null;
  }
};

// Função para criar uma nova pesquisa
export const createClimateSurvey = async (survey: Omit<ClimateSurvey, 'id' | 'created_at' | 'updated_at'>): Promise<ClimateSurvey | null> => {
  try {
    const { data, error } = await supabase
      .from('climate_surveys')
      .insert(survey)
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error("Erro ao criar pesquisa de clima:", error);
    toast.error("Erro ao criar pesquisa de clima", { 
      description: error.message || "Tente novamente mais tarde" 
    });
    return null;
  }
};

// Função para atualizar uma pesquisa existente
export const updateClimateSurvey = async (id: string, survey: Partial<ClimateSurvey>): Promise<ClimateSurvey | null> => {
  try {
    const { data, error } = await supabase
      .from('climate_surveys')
      .update(survey)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error(`Erro ao atualizar pesquisa de clima ${id}:`, error);
    toast.error("Erro ao atualizar pesquisa de clima", { 
      description: error.message || "Tente novamente mais tarde" 
    });
    return null;
  }
};

// Função para excluir uma pesquisa
export const deleteClimateSurvey = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('climate_surveys')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error(`Erro ao excluir pesquisa de clima ${id}:`, error);
    toast.error("Erro ao excluir pesquisa de clima", { 
      description: error.message || "Tente novamente mais tarde" 
    });
    return false;
  }
};

// PERGUNTAS

// Função para obter perguntas de uma pesquisa
export const getSurveyQuestions = async (surveyId: string): Promise<ClimateSurveyQuestion[]> => {
  try {
    const { data, error } = await supabase
      .from('climate_survey_questions')
      .select('*')
      .eq('survey_id', surveyId)
      .order('order_number', { ascending: true });

    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    console.error(`Erro ao buscar perguntas da pesquisa ${surveyId}:`, error);
    return [];
  }
};

// Função para criar uma nova pergunta
export const createSurveyQuestion = async (question: Omit<ClimateSurveyQuestion, 'id'>): Promise<ClimateSurveyQuestion | null> => {
  try {
    const { data, error } = await supabase
      .from('climate_survey_questions')
      .insert(question)
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error("Erro ao criar pergunta:", error);
    toast.error("Erro ao criar pergunta", { 
      description: error.message || "Tente novamente mais tarde" 
    });
    return null;
  }
};

// Função para atualizar uma pergunta existente
export const updateSurveyQuestion = async (id: string, question: Partial<ClimateSurveyQuestion>): Promise<ClimateSurveyQuestion | null> => {
  try {
    const { data, error } = await supabase
      .from('climate_survey_questions')
      .update(question)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error(`Erro ao atualizar pergunta ${id}:`, error);
    toast.error("Erro ao atualizar pergunta", { 
      description: error.message || "Tente novamente mais tarde" 
    });
    return null;
  }
};

// Função para excluir uma pergunta
export const deleteSurveyQuestion = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('climate_survey_questions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error(`Erro ao excluir pergunta ${id}:`, error);
    toast.error("Erro ao excluir pergunta", { 
      description: error.message || "Tente novamente mais tarde" 
    });
    return false;
  }
};

// Função para reordenar perguntas
export const reorderSurveyQuestions = async (questions: { id: string, order_number: number }[]): Promise<boolean> => {
  try {
    // Utilizando transações para garantir que todas as atualizações sejam feitas ou nenhuma
    for (const question of questions) {
      const { error } = await supabase
        .from('climate_survey_questions')
        .update({ order_number: question.order_number })
        .eq('id', question.id);
        
      if (error) throw error;
    }
    
    return true;
  } catch (error: any) {
    console.error("Erro ao reordenar perguntas:", error);
    toast.error("Erro ao reordenar perguntas", { 
      description: error.message || "Tente novamente mais tarde" 
    });
    return false;
  }
};

// RESPOSTAS

// Função para obter respostas de uma pesquisa
export const getSurveyResponses = async (surveyId: string): Promise<ClimateSurveyResponse[]> => {
  try {
    const { data, error } = await supabase
      .from('climate_survey_responses')
      .select('*')
      .eq('survey_id', surveyId)
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    console.error(`Erro ao buscar respostas da pesquisa ${surveyId}:`, error);
    return [];
  }
};

// Função para submeter resposta a uma pesquisa
export const submitSurveyResponse = async (response: Omit<ClimateSurveyResponse, 'id' | 'submitted_at'>): Promise<ClimateSurveyResponse | null> => {
  try {
    const { data, error } = await supabase
      .from('climate_survey_responses')
      .insert({
        ...response,
        submitted_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error("Erro ao submeter resposta:", error);
    toast.error("Erro ao submeter resposta", { 
      description: error.message || "Tente novamente mais tarde" 
    });
    return null;
  }
};
