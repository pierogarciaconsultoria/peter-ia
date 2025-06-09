
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
  created_at: string;
  updated_at: string;
}

// NOTA: Estas funções estão desabilitadas porque a tabela 'supplier_evaluations' não existe no banco atual
// Para usar este serviço, primeiro crie a tabela no banco de dados

export async function getSupplierEvaluations(): Promise<SupplierEvaluation[]> {
  console.warn("Tabela 'supplier_evaluations' não existe no banco de dados atual");
  return [];
}

export async function getSupplierEvaluationById(id: string): Promise<SupplierEvaluation | null> {
  console.warn("Tabela 'supplier_evaluations' não existe no banco de dados atual");
  return null;
}

export async function createSupplierEvaluation(evaluation: Omit<SupplierEvaluation, 'id' | 'created_at' | 'updated_at'>): Promise<SupplierEvaluation | null> {
  console.warn("Tabela 'supplier_evaluations' não existe no banco de dados atual");
  return null;
}

export async function updateSupplierEvaluation(id: string, evaluation: Partial<Omit<SupplierEvaluation, 'id' | 'created_at' | 'updated_at'>>): Promise<SupplierEvaluation | null> {
  console.warn("Tabela 'supplier_evaluations' não existe no banco de dados atual");
  return null;
}

export async function deleteSupplierEvaluation(id: string): Promise<void> {
  console.warn("Tabela 'supplier_evaluations' não existe no banco de dados atual");
}
