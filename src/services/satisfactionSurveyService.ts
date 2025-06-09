
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

// NOTA: Estas funções estão desabilitadas porque a tabela 'customer_satisfaction_surveys' não existe no banco atual
// Para usar este serviço, primeiro crie a tabela no banco de dados

export async function getSatisfactionSurveys(): Promise<SatisfactionSurvey[]> {
  console.warn("Tabela 'customer_satisfaction_surveys' não existe no banco de dados atual");
  return [];
}

export async function getSatisfactionSurveyById(id: string): Promise<SatisfactionSurvey> {
  console.warn("Tabela 'customer_satisfaction_surveys' não existe no banco de dados atual");
  throw new Error("Tabela não existe no banco de dados atual");
}

export async function createSatisfactionSurvey(survey: Omit<SatisfactionSurvey, 'id' | 'created_at' | 'updated_at'>): Promise<SatisfactionSurvey> {
  console.warn("Tabela 'customer_satisfaction_surveys' não existe no banco de dados atual");
  throw new Error("Tabela não existe no banco de dados atual");
}

export async function updateSatisfactionSurvey(id: string, survey: Partial<Omit<SatisfactionSurvey, 'id' | 'created_at' | 'updated_at'>>): Promise<SatisfactionSurvey> {
  console.warn("Tabela 'customer_satisfaction_surveys' não existe no banco de dados atual");
  throw new Error("Tabela não existe no banco de dados atual");
}

export async function deleteSatisfactionSurvey(id: string): Promise<void> {
  console.warn("Tabela 'customer_satisfaction_surveys' não existe no banco de dados atual");
}
