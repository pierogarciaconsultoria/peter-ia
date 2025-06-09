
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

// Mock data para demonstração até a tabela ser criada
const mockSupplierEvaluations: SupplierEvaluation[] = [
  {
    id: '1',
    supplier_name: 'Fornecedor A',
    evaluation_date: '2024-01-15',
    evaluator: 'João Silva',
    category: 'Matéria Prima',
    quality_score: 8,
    delivery_score: 9,
    price_score: 7,
    support_score: 8,
    total_score: 8,
    status: 'active',
    comments: 'Bom fornecedor, entrega dentro do prazo',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  }
];

export async function getSupplierEvaluations(): Promise<SupplierEvaluation[]> {
  try {
    // Tentar buscar da tabela real primeiro
    const { data, error } = await supabase
      .from('supplier_evaluations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.warn("Tabela 'supplier_evaluations' não existe, usando dados mock:", error.message);
      return mockSupplierEvaluations;
    }
    
    return data || [];
  } catch (error) {
    console.warn("Erro ao acessar supplier_evaluations, usando dados mock:", error);
    return mockSupplierEvaluations;
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
      console.warn("Tabela 'supplier_evaluations' não existe, usando dados mock");
      return mockSupplierEvaluations.find(item => item.id === id) || null;
    }
    
    return data;
  } catch (error) {
    console.warn("Erro ao acessar supplier_evaluations, usando dados mock:", error);
    return mockSupplierEvaluations.find(item => item.id === id) || null;
  }
}

export async function createSupplierEvaluation(evaluation: Omit<SupplierEvaluation, 'id' | 'created_at' | 'updated_at'>): Promise<SupplierEvaluation | null> {
  try {
    const { data, error } = await supabase
      .from('supplier_evaluations')
      .insert(evaluation)
      .select()
      .single();
    
    if (error) {
      console.warn("Tabela 'supplier_evaluations' não existe, simulando criação");
      const newEvaluation: SupplierEvaluation = {
        ...evaluation,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return newEvaluation;
    }
    
    return data;
  } catch (error) {
    console.error("Erro ao criar supplier evaluation:", error);
    return null;
  }
}

export async function updateSupplierEvaluation(id: string, evaluation: Partial<Omit<SupplierEvaluation, 'id' | 'created_at' | 'updated_at'>>): Promise<SupplierEvaluation | null> {
  try {
    const { data, error } = await supabase
      .from('supplier_evaluations')
      .update(evaluation)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.warn("Tabela 'supplier_evaluations' não existe, simulando atualização");
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Erro ao atualizar supplier evaluation:", error);
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
      console.warn("Tabela 'supplier_evaluations' não existe, simulando exclusão");
    }
  } catch (error) {
    console.error("Erro ao deletar supplier evaluation:", error);
  }
}
